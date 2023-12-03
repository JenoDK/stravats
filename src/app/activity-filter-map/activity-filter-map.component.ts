import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { SearchResult } from 'leaflet-geosearch/src/providers/provider';

@Component({
    selector: 'app-activity-filter-map',
    templateUrl: './activity-filter-map.component.html',
    styleUrls: ['./activity-filter-map.component.scss'],
})
export class ActivityFilterMapComponent implements OnInit {
    private map: any;
    public searchResults: SearchResult[] = [];
    private selectedPosition: Leaflet.LatLng;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.initMap();
    }

    initMap() {
        const mapDiv = document.getElementById('filter-map');
        // If a location was previously found use it else london
        const startingLocation = localStorage.getItem('geo-location') ? JSON.parse(localStorage.getItem('geo-location')) : [51.505, -0.09];
        this.map = Leaflet.map(mapDiv, { doubleClickZoom: false }).setView(startingLocation, 13);
        if (navigator.geolocation) {
            this.map.locate({ setView: true, maxZoom: 16 })
                .on('locationfound', function (e) {
                    localStorage.setItem('geo-location', JSON.stringify([e.latitude, e.longitude]));
                });
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
            this.selectedPosition = event.latlng;
            this.addMarkerWithCircle(event.latlng);
        });
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
            radius: 1000, // Radius in meters
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
}
