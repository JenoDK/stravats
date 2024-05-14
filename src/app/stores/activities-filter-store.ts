import { computed, Injectable, signal } from '@angular/core';
import * as Leaflet from 'leaflet';
import { toObservable } from '@angular/core/rxjs-interop';

export interface RadiusOption {
	name: string;
	radius: number;
}

export const DEFAULT_RADIUS: RadiusOption = {
	name: '2km',
	radius: 2000
}

@Injectable({ providedIn: 'root' })
export class ActivitiesFilterStore {
    private readonly state = {
        $location: signal<Leaflet.LatLng>(undefined),
        $radius: signal<RadiusOption>(DEFAULT_RADIUS),
    } as const;

    public readonly $location = this.state.$location.asReadonly();
    public readonly $radius = this.state.$radius.asReadonly();
    public readonly $filterChanged = toObservable(computed(() => {
        return {
            location: this.$location(),
            radius: this.$radius(),
        }
    }));

    setLocation(location: Leaflet.LatLng) {
        this.state.$location.set(location);
    }

    setRadius(radius: RadiusOption) {
        this.state.$radius.set(radius);
    }

}
