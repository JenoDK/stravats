import { Component, inject, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DetailedActivity } from '../model/strava';
import { AppLauncher } from '@capacitor/app-launcher';
import { Browser } from '@capacitor/browser';
import { getActivityIcon } from '../common/Utils';

@Component({
	selector: 'app-activity',
	templateUrl: './activity.component.html',
	styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
	private platform = inject(Platform);
	@Input() activity?: DetailedActivity;

	activityIcon: string;

	ngOnInit(): void {
		this.activityIcon = getActivityIcon(this.activity.type);
	}

	isIos() {
		return this.platform.is('ios');
	}

	openStravaActivity() {
		const startStravaOAuthFlow = async () => {
			const canOpenApp = await AppLauncher.canOpenUrl({
				url: 'strava://',
			});
			if (canOpenApp.value) {
				const activityUrl = `strava://activities/${this.activity.id}`;
				// If the Strava app is installed, attempt to open it
				return AppLauncher.openUrl({ url: activityUrl });
			} else {
				const activityUrl = `https://www.strava.com/activities/${this.activity.id}`;
				// If the Strava app is not installed, open the authorization URL in the browser
				return Browser.open({ url: activityUrl });
			}
		};
		startStravaOAuthFlow().then(() => {});
	}
}
