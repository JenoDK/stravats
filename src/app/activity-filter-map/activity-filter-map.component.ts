import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import * as Leaflet from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { SearchResult } from 'leaflet-geosearch/src/providers/provider';
import { ActivitiesFilterStore } from '../stores/activities-filter-store';

@Component({
    selector: 'app-activity-filter-map',
    templateUrl: './activity-filter-map.component.html',
    styleUrls: ['./activity-filter-map.component.scss'],
})
export class ActivityFilterMapComponent implements OnInit {
    private readonly filterStore: ActivitiesFilterStore = inject(ActivitiesFilterStore);

    @Output() public modalClosed = new EventEmitter<void>();
    private map: any;
    public searchResults: SearchResult[] = [];
    private location: Leaflet.LatLng = this.filterStore.$location();
    private radius: number = this.filterStore.$radius();

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.initMap();
    }

    initMap() {
        const mapDiv = document.getElementById('filter-map');
        // If a location was previously found use it else brussels
        this.map = Leaflet.map(mapDiv, { doubleClickZoom: false });
        if (this.location) {
            this.map.setView(this.location, 13);
        } else {
            this.map.locate({ setView: true, maxZoom: 16 })
                .on('locationfound', function (e) {
                    this.map.setView(e.latlng, 16);
                })
                .on('locationerror', () => this.map.setView([50.85045, 4.34878], 16));
        }
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(this.map);

        const resizeObserver = new ResizeObserver(() => {
            this.map.invalidateSize();
        });
        resizeObserver.observe(mapDiv);
        this.map.invalidateSize()
        this.map.on('click', (event) => {
            this.location = event.latlng;
            this.addMarkerWithCircle(event.latlng);
        });
        if (this.location) {
            this.addMarkerWithCircle(this.location);
        }
    }

    private addMarkerWithCircle(latlng: Leaflet.LatLng): void {
        // Clear existing markers and circles
        this.map.eachLayer((layer) => {
            if (layer instanceof Leaflet.Marker || layer instanceof Leaflet.Circle) {
                this.map.removeLayer(layer);
            }
        });
        // Define Strava colors
        const stravaRed = '#FC4C02';
        // Add a circle around the marker with Strava styling
        Leaflet.circle(latlng, {
            color: stravaRed,
            fillColor: stravaRed,
            fillOpacity: 0.2,
            radius: this.radius, // Radius in meters
        }).addTo(this.map);
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
        this.filterStore.setRadius(this.radius);
        this.modalClosed.emit();
    }
}
