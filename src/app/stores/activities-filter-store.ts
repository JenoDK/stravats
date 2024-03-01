import { Injectable, signal } from '@angular/core';
import * as Leaflet from 'leaflet';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ActivitiesFilterStore {
    private readonly state = {
        $location: signal<Leaflet.LatLng>(undefined),
        $radius: signal<number>(2000),
    } as const;

    public readonly $location = this.state.$location.asReadonly();
    public readonly $locationObs = toObservable(this.state.$location);
    public readonly $radius = this.state.$radius.asReadonly();

    setLocation(location: Leaflet.LatLng) {
        this.state.$location.set(location);
    }

    setRadius(radius: number) {
        this.state.$radius.set(radius);
    }

}
