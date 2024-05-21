import { Component, NgZone, isDevMode } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {

	isDevMode: boolean = isDevMode();

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

	clearData() {
		localStorage.clear();
		this.router.navigate(['/connect']);
	}
}
