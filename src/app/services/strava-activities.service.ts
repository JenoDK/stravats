import { Injectable } from '@angular/core';
import { StravaApiService } from './strava-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetailedActivity } from '../model/strava';
import { handleError } from '../common/Utils';

@Injectable({
	providedIn: 'root',
})
export class StravaActivitiesService {
	private readonly perPageSize = 50;

	private isLoadingActivities$: BehaviorSubject<boolean> = new BehaviorSubject(
		false,
	);
	public isLoadingActivities = this.isLoadingActivities$.asObservable();

	private isFirstPageFetched$: BehaviorSubject<boolean> = new BehaviorSubject(
		false,
	);
	public isFirstPageFetched = this.isFirstPageFetched$.asObservable();

	constructor(private stravaApiService: StravaApiService) {}

	loadAllActivities() {
		this.isLoadingActivities$.next(true);
		const storedActivities = this.getStoredActivities(1);
		if (storedActivities) {
			this.getActivities(1, 1).subscribe({
				next: (activities: DetailedActivity[]) => {
					if (activities && activities.length > 0 && storedActivities.findIndex((value) => value.id === activities[0].id) === -1) {
						this.clearStoredActivities();
						this.loadActivitiesRecursive(1);
					} else {
						this.finishLoading();
					}
				},
				error: (e) => {
					this.finishLoading();
					handleError(e);
				},
			});
		} else {
			this.clearStoredActivities();
			this.loadActivitiesRecursive(1);
		}
	}

	getActivities(
		page: number,
		perPage: number,
	): Observable<DetailedActivity[]> {
		const endpoint = `athlete/activities`;
		const options = {
			params: {
				page: page.toString(),
				per_page: perPage.toString(),
			},
		};
		return this.stravaApiService.request<DetailedActivity[]>(
			'GET',
			endpoint,
			options,
		);
	}

	private loadActivitiesRecursive(page: number): void {
		this.getActivities(page, this.perPageSize)
			.subscribe({
				next: (avs: DetailedActivity[]) => {
					if (avs.length > 0) {
						this.storeActivities(page, avs);
						if (page === 1) {
							this.isFirstPageFetched$.next(true);
						}
						// Load the next page
						this.loadActivitiesRecursive(page + 1);
					} else {
						this.finishLoading();
					}
				},
				error: (error) => {
					console.error('Error loading activities:', error);
				},
			});
	}

	private finishLoading() {
		this.isFirstPageFetched$.next(true);
		this.isLoadingActivities$.next(false);
	}

	private storeActivities(page: number, activities: DetailedActivity[]) {
		// Store activities in localStorage
		localStorage.setItem(
			`activities_page_${page}`,
			JSON.stringify(activities),
		);
	}

	getStoredActivities(page: number): DetailedActivity[] | null {
		// Retrieve activities from localStorage
		const storedActivities = localStorage.getItem(
			`activities_page_${page}`,
		);
		return storedActivities ? JSON.parse(storedActivities) : null;
	}

	private clearStoredActivities() {
		// Clear all stored activities in localStorage
		let page = 1;
		let removed = false;

		while (page <= 99999) {
			const key = `activities_page_${page}`;
			const storedActivities = localStorage.getItem(key);

			if (storedActivities) {
				localStorage.removeItem(key);
				removed = true;
			} else {
				// Break the loop if no item is found
				break;
			}

			page++;
		}

		if (removed) {
			console.log('Stored activities cleared successfully.');
		} else {
			console.log('No stored activities found to clear.');
		}
	}

}
