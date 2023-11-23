import { Component, inject, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController, RefresherCustomEvent, } from '@ionic/angular';
import { StravaActivitiesService } from '../services/strava-activities.service';
import { DetailedActivity } from '../model/strava';
import { map, take, timer } from 'rxjs';

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
		const loading = await this.loadingCtrl.create();
		this.stravaActivitiesService.isLoadingActivities.subscribe({
			next: (isLoading) => {
				if (isLoading) {
					loading.present();
				} else {
					loading.dismiss();
				}
			},
		});
		timer(100).pipe(
			take(1),
			map(ignored => this.stravaActivitiesService.isFirstPageFetched),
		).subscribe(firstPageIsFetched => {
			if (firstPageIsFetched) {
				this.loadRecentActivities(1, () => {});
				loading.dismiss();
			}
		});
	}

	refresh(ev: any) {
		(ev as RefresherCustomEvent).detail.complete();
	}

	loadRecentActivities(page: number, callback: Function) {
		const storedActivities = this.stravaActivitiesService.getStoredActivities(page);
		if (storedActivities) {
			this.activities = this.activities.concat(storedActivities);
			callback();
		}
	}

	fetchNextActivities($event: any) {
		this.page = this.page + 1;
		this.loadRecentActivities(this.page, () =>
			this.completeScrollEvent($event),
		);
	}

	private completeScrollEvent($event: any) {
		if ($event) {
			($event as InfiniteScrollCustomEvent).target.complete();
		}
	}

}
