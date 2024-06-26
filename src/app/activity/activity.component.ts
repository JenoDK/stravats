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

	ngAfterViewInit() {
		this.initMap();
	}

	initMap() {
		if (this.activity.map.summary_polyline) {
			const mapDiv = document.getElementById(`map-${this.activity.id}`);
			const map = Leaflet.map(mapDiv, { zoomControl: false });
			Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			}).addTo(map);
			map._handlers.forEach(function(handler) {
				handler.disable();
			});

			const decoded = decode(this.activity.map.summary_polyline);
			if (decoded.length > 0) {
				Leaflet.polyline(decoded, { color: 'orange' }).addTo(map);
				const bounds = new Leaflet.LatLngBounds(decoded);
				function fitMapToPolyline() {
					const resizeObserver = new ResizeObserver(() => {
						map.fitBounds(bounds);
					});
					resizeObserver.observe(mapDiv);
				}
				setTimeout(() => fitMapToPolyline(), 200);
			}
		}
	}

	isIos() {
		return this.platform.is('ios');
	}

	openStravaActivity() {
		const openStravaApp = async () => {
			const canOpenApp = await AppLauncher.canOpenUrl({
				url: 'strava://',
			});
			const isMobile = !this.platform.is('desktop');
			if (canOpenApp.value && isMobile) {
				// If the Strava app is installed, attempt to open it
				return AppLauncher.openUrl({ url: `strava://activities/${this.activity.id}` });
			} else {
				const activityUrl = `https://www.strava.com/activities/${this.activity.id}`;
				// If the Strava app is not installed, open the authorization URL in the browser
				return Browser.open({ url: activityUrl });
			}
		};
		openStravaApp().then(() => {});
	}

}
