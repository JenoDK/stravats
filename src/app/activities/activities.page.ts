import { Component, inject, OnInit } from '@angular/core';
import { LoadingController, } from '@ionic/angular';
import { ActivitiesStore } from '../stores/activities-store';

@Component({
	selector: 'app-activities',
	templateUrl: './activities.page.html',
	styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
	activitiesStore = inject(ActivitiesStore);
	private loadingCtrl = inject(LoadingController);
	private loading: HTMLIonLoadingElement;

	ngOnInit(): void {
		this.setLoading();
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

	private async setLoading() {
		this.loading = await this.loadingCtrl.create();
	}

	refresh(ev: any) {
		this.activitiesStore.refresh(ev);
	}

	fetchNextActivities($event: any) {
		this.activitiesStore.fetchNextPage($event);
	}

}
