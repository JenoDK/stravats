import { Component, inject, OnInit } from '@angular/core';
import { LoadingController, } from '@ionic/angular';
import { ActivitiesStore } from '../stores/activities-store';
import { StravaActivitiesService } from '../services/strava-activities.service';

@Component({
	selector: 'app-activities',
	templateUrl: './activities.page.html',
	styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
	activitiesStore = inject(ActivitiesStore);
	private readonly activitiesService = inject(StravaActivitiesService);
	private loadingCtrl = inject(LoadingController);
	private loading: HTMLIonLoadingElement;

	ngOnInit(): void {
		this.setLoading();
	}

	private async setLoading() {
		this.loading = await this.loadingCtrl.create();
		this.activitiesStore.$loading.subscribe({
			next: (isLoading) => {
				if (isLoading) {
					this.loading.present();
				} else {
					this.loading.dismiss();
				}
			},
		});
	}

	refresh(ev: any) {
		this.activitiesService.refresh(ev);
	}

	fetchNextActivities($event: any) {
		this.activitiesStore.fetchNextPage($event);
	}

}
