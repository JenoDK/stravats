import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StravaAuthService } from '../services/strava-auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-strava-redirect',
	templateUrl: './strava-redirect.page.html',
	styleUrls: ['./strava-redirect.page.scss'],
})
export class StravaRedirectPage {
	constructor(
		private route: ActivatedRoute,
		private stravaAuthService: StravaAuthService,
		private loadingCtrl: LoadingController,
	) {}

	ionViewDidEnter() {
		// This method will be called every time the page has fully entered
		// You can put your logic here
		this.checkForAuthCode();
	}

	private async checkForAuthCode() {
		const loading = await this.loadingCtrl.create({
			duration: 3000,
		});
		loading.present();
		console.log(`Arrived in the redirect page`);
		const code = this.route.snapshot.queryParamMap.get('code');
		if (code != null && !this.stravaAuthService.userIsAuthenticated()) {
			this.stravaAuthService.getAccessToken(code, loading);
		}
	}
}
