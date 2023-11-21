import { Component, NgZone } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';
import { STRAVA_TOKEN_VALUE_STORAGE_KEY } from './services/strava-auth.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	constructor(
		private router: Router,
		private zone: NgZone,
	) {
		this.initializeApp();
	}

	initializeApp() {
		App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
			console.log(event.url);
			this.zone.run(() => {
				// Example url: https://beerswift.app/tabs/tab2
				// slug = /tabs/tab2
				const slug = event.url.split('stravats').pop();
				console.log(slug);
				if (slug) {
					this.router.navigateByUrl(slug);
				}
				// If no match, do nothing - let regular routing
				// logic take over
			});
		});
	}

	clearToken() {
		localStorage.removeItem(STRAVA_TOKEN_VALUE_STORAGE_KEY);
		this.router.navigate(['/connect']);
	}
}
