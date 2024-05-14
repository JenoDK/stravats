import { Component, inject, OnInit } from '@angular/core';
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

	ngOnInit(): void {
	}

	refresh(ev: any) {
		this.activitiesService.refresh(ev);
	}

	fetchNextActivities($event: any) {
		this.activitiesStore.fetchNextPage($event);
	}

}
