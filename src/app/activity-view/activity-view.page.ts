import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DetailedActivity } from '../model/strava';

@Component({
	selector: 'app-activity-view',
	templateUrl: './activity-view.page.html',
	styleUrls: ['./activity-view.page.scss'],
})
export class ActivityViewPage implements OnInit {
	public activity!: DetailedActivity;
	private activatedRoute = inject(ActivatedRoute);
	private platform = inject(Platform);

	constructor() {}

	ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
	}

	getBackButtonText() {
		const isIos = this.platform.is('ios');
		return isIos ? 'Activities' : '';
	}
}
