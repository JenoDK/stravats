import { Component, inject, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DetailedActivity } from '../model/strava';
import { AppLauncher } from '@capacitor/app-launcher';
import { Browser } from '@capacitor/browser';
import { getActivityIcon } from '../common/Utils';
import * as Leaflet from 'leaflet';
import { decode } from 'google-polyline';
import { ActivityType } from '../model/strava/enums';

@Component({
	selector: 'app-activity',
	templateUrl: './activity.component.html',
	styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
	private platform = inject(Platform);
	protected readonly ActivityType = ActivityType;

	@Input() activity?: DetailedActivity;

	activityIcon: string;

	ngOnInit(): void {
		this.activityIcon = getActivityIcon(this.activity.type);
	}

	ngAfterViewInit () {
		this.initMap();
	}

	initMap() {
		const decoded = decode(this.activity.map.summary_polyline);
		const mapDiv = document.getElementById(`map-${this.activity.id}`);

		if (decoded.length > 0) {
			const map = Leaflet.map(mapDiv, { zoomControl: false });
			Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			}).addTo(map);
			Leaflet.polyline(decoded, { color: 'orange' }).addTo(map);
			map._handlers.forEach(function(handler) {
				handler.disable();
			});
			function fitMapToPolyline() {
				const resizeObserver = new ResizeObserver(() => {
					var bounds = new Leaflet.LatLngBounds(decoded);
					map.fitBounds(bounds);
					map.invalidateSize();
				});

				resizeObserver.observe(mapDiv);
			}
			map.on('load', function(e) {
				fitMapToPolyline();
			});
			fitMapToPolyline();
		}
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
