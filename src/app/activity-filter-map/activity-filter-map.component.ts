import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import * as Leaflet from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { SearchResult } from 'leaflet-geosearch/src/providers/provider';
import { ActivitiesFilterStore, DEFAULT_RADIUS, RadiusOption } from '../stores/activities-filter-store';
import { Geolocation } from '@capacitor/geolocation';

@Component({
    selector: 'app-activity-filter-map',
    templateUrl: './activity-filter-map.component.html',
    styleUrls: ['./activity-filter-map.component.scss'],
})
export class ActivityFilterMapComponent implements OnInit {
    readonly filterStore: ActivitiesFilterStore = inject(ActivitiesFilterStore);

    @Output() public modalClosed = new EventEmitter<void>();
    private map: any;
    public searchResults: SearchResult[] = [];
    private location: Leaflet.LatLng = this.filterStore.$location();
	radiusOption: RadiusOption = this.filterStore.$radius();
	possibleRadiuses: RadiusOption[] = [
		DEFAULT_RADIUS,
		{
			name: '5km',
			radius: 5000
		},
		{
			name: '10km',
			radius: 10000
		},
		{
			name: '25km',
			radius: 25000
		},
		{
			name: '100km',
			radius: 100000
		},
		{
			name: '1000km',
			radius: 1000000
		},
	];
    compareWithFn = (radius1, radius2) => {
        return radius1 && radius1 ? radius1.radius === radius2.radius : radius1 === radius2;
    };
    compareWith = this.compareWithFn;

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.initMap();
    }

    setMapToCurrentPosition = async () => {
        if (localStorage.getItem('geo-location')) {
            this.map.setView(JSON.parse(localStorage.getItem('geo-location')), 13);
        } else {
            this.map.setView([50.85045, 4.34878], 10);
        }
        const coordinates = await Geolocation.getCurrentPosition();
        if (coordinates) {
            console.debug('Location found', coordinates);
            localStorage.setItem('geo-location', JSON.stringify([coordinates.coords.latitude, coordinates.coords.longitude]));
            this.map.setView([coordinates.coords.latitude, coordinates.coords.longitude], 13);
        }
    };

    initMap() {
        const mapDiv = document.getElementById('filter-map');
        // If a location was previously found use it else brussels
        this.map = Leaflet.map(mapDiv, { doubleClickZoom: false });
        if (this.location) {
            this.map.setView(this.location, 13);
        } else {
            this.setMapToCurrentPosition();
        }
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(this.map);

        const resizeObserver = new ResizeObserver(() => {
            this.map.invalidateSize();
        });
        resizeObserver.observe(mapDiv);
        this.map.on('click', (event) => {
            this.location = event.latlng;
            var circle = this.addMarkerWithCircle(event.latlng);
            this.map.fitBounds(circle.getBounds());
        });
        if (this.location) {
            var circle = this.addMarkerWithCircle(this.location);
            setTimeout(() => this.map.fitBounds(circle.getBounds()), 200);
        }
    }

    private addMarkerWithCircle(latlng: Leaflet.LatLng): any {
        // Clear existing markers and circles
        this.map.eachLayer((layer) => {
            if (layer instanceof Leaflet.Marker || layer instanceof Leaflet.Circle) {
                this.map.removeLayer(layer);
            }
        });
        // Define Strava colors
        const stravaRed = '#FC4C02';
        // Add a circle around the marker with Strava styling
        var circle = Leaflet.circle(latlng, {
            color: stravaRed,
            fillColor: stravaRed,
            fillOpacity: 0.2,
            radius: this.radiusOption.radius, // Radius in meters
        });
        circle.addTo(this.map);
        return circle;
    }

    async search(event) {
        const query = event.target.value.toLowerCase();
        if (query === '') {
            this.searchResults = [];
        } else if (query.length > 2) {
            const provider = new OpenStreetMapProvider();
            this.searchResults = await provider.search({ query: query });
        }
    }

    setMap(result: SearchResult) {
        this.map.setView([result.y, result.x], 13);
        this.searchResults = [];
    }

    applyFilters() {
        this.filterStore.setLocation(this.location);
        this.filterStore.setRadius(this.radiusOption);
        this.modalClosed.emit();
    }

	setRadius($event: any) {
		if ($event?.detail?.value) {
			this.radiusOption = $event.detail.value;
		}
	}

	headerResized($event: HTMLElement) {
		if ($event && $event.getBoundingClientRect()) {
			let searchAndRadiusHeight = $event.getBoundingClientRect().height;
			let r = document.querySelector(':root') as HTMLElement;
			const searchAndRadiusHeightCssProperty = '--search-and-radius-height';
			const newHeight = `calc(${searchAndRadiusHeight}px + 44px)`;
			if (newHeight !== r.style.getPropertyValue(searchAndRadiusHeightCssProperty)) {
				r.style.setProperty(searchAndRadiusHeightCssProperty, newHeight);
			}
		}
	}
}
