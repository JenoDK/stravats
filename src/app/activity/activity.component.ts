import { Component, inject, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DetailedActivity } from '../model/strava';
import { AppLauncher } from '@capacitor/app-launcher';
import { Browser } from '@capacitor/browser';
import { getActivityIcon } from '../common/Utils';
import * as Leaflet from 'leaflet';

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

	ngAfterViewInit () {
		this.initMap();
	}

	initMap() {
		const mapDiv = document.getElementById(`map-${this.activity.id}`);
		const map = Leaflet.map(mapDiv).setView([51.505, -0.09], 13);
		Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		}).addTo(map);
		// Draw GPS data on the map (example coordinates)
		const polyline = Leaflet.polyline([[51.505, -0.09], [51.51, -0.1], [51.51, -0.12]], { color: 'red' }).addTo(map);

		// Fit the map to the polyline bounds
		map.fitBounds(polyline.getBounds());
		const resizeObserver = new ResizeObserver(() => {
			map.invalidateSize();
		});

		resizeObserver.observe(mapDiv);
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
