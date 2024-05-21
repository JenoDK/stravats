import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { icon, Marker } from 'leaflet';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { addIcons } from 'ionicons';

if (environment.production) {
	enableProdMode();
}

addIcons({
	strava: 'assets/icon/strava.svg',
});

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => console.log(err));

// Load in leaflet assets for angular, see https://stackoverflow.com/a/51232969
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;
