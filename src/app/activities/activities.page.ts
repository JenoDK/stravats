import { Component, inject, OnInit } from '@angular/core';
import {
	InfiniteScrollCustomEvent,
	LoadingController,
	RefresherCustomEvent,
} from '@ionic/angular';
import { StravaActivitiesService } from '../services/strava-activities.service';
import { DetailedActivity } from '../model/strava';
import { handleError } from '../common/Utils';

@Component({
	selector: 'app-activities',
	templateUrl: './activities.page.html',
	styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
	private page = 1;
	activities: DetailedActivity[] = [];

	private stravaActivitiesService = inject(StravaActivitiesService);
	private loadingCtrl = inject(LoadingController);

	constructor() {}

	ngOnInit(): void {
		this.initActivities();
	}

	private async initActivities() {
		const loading = await this.loadingCtrl.create({
			duration: 3000,
		});
		loading.present();
		this.checkForNewActivities(() => loading.dismiss());
	}

	private checkForNewActivities(callback: Function) {
		const storedActivities = this.getStoredActivities(1);
		if (storedActivities) {
			this.stravaActivitiesService.getActivities(1, 1).subscribe({
				next: (activities: DetailedActivity[]) => {
					if (activities && activities.length > 0) {
						if (
							storedActivities.findIndex(
								(value) => value.id === activities[0].id,
							) === -1
						) {
							this.clearStoredActivities();
							this.activities = [];
						}
					}
					this.loadRecentActivities(this.page, callback);
				},
				error: (e) => {
					this.loadRecentActivities(this.page, callback);
				},
			});
		} else {
			this.loadRecentActivities(this.page, callback);
		}
	}

	refresh(ev: any) {
		this.checkForNewActivities(() =>
			(ev as RefresherCustomEvent).detail.complete(),
		);
	}

	fetchNextActivities($event: any) {
		this.page = this.page + 1;
		this.loadRecentActivities(this.page, () =>
			this.completeScrollEvent($event),
		);
	}

	loadRecentActivities(page: number, callback: Function) {
		const perPage = 30;

		// Check if activities are already in localStorage
		const storedActivities = this.getStoredActivities(page);
		if (storedActivities) {
			this.activities = this.activities.concat(storedActivities);
			callback();
		} else {
			// Fetch activities from the service if not found in localStorage
			this.stravaActivitiesService
				.getActivities(page, perPage)
				.subscribe({
					next: (activities: DetailedActivity[]) => {
						this.activities = this.activities.concat(activities);
						this.storeActivities(page, activities);
						callback();
					},
					error: (e) => {
						handleError(e);
						callback();
					},
				});
		}
	}

	private storeActivities(page: number, activities: DetailedActivity[]) {
		// Store activities in localStorage
		localStorage.setItem(
			`activities_page_${page}`,
			JSON.stringify(activities),
		);
	}

	private getStoredActivities(page: number): DetailedActivity[] | null {
		// Retrieve activities from localStorage
		const storedActivities = localStorage.getItem(
			`activities_page_${page}`,
		);
		return storedActivities ? JSON.parse(storedActivities) : null;
	}

	private completeScrollEvent($event: any) {
		if ($event) {
			($event as InfiniteScrollCustomEvent).target.complete();
		}
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

	forceRefresh() {
		const storedActivities = this.getStoredActivities(1);
		if (storedActivities) {
			storedActivities.shift();
			this.storeActivities(1, storedActivities);
		}
	}
}
