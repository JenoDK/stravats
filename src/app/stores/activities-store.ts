import { computed, inject, Injectable, signal } from '@angular/core';
import { DetailedActivity } from '../model/strava';
import { distinctUntilChanged, filter, skip } from 'rxjs';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { decode } from 'google-polyline';
import { ActivitiesFilterStore } from './activities-filter-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ActivitiesStore {
    private readonly filterStore = inject(ActivitiesFilterStore);
    private readonly state = {
        $loading: signal<boolean>(true),
        $activities: signal<DetailedActivity[]>([]),
        $filteredActivities: signal<DetailedActivity[]>([]),
    } as const;

    public readonly $loading = this.state.$loading.asReadonly();
    public readonly $activities = this.state.$activities.asReadonly();
	public readonly $activitiesLength = computed(() => this.state.$filteredActivities().length);
	public readonly $filteredActivities = this.state.$filteredActivities.asReadonly();

    constructor() {
        this.filterStore.$filterChanged.pipe(
            filter(filter => !!filter),
            distinctUntilChanged(),
            takeUntilDestroyed(),
			skip(1),
        ).subscribe(() => {
            this.state.$loading.set(true);
            this.setFilteredActivities();
            this.state.$loading.set(false);
		});
    }

    isLoading(isLoading: boolean) {
        this.state.$loading.set(isLoading);
    }

    fetchNextPage($event: any) {
        if ($event) {
            ($event as InfiniteScrollCustomEvent).target.complete();
        }
    }

    reset() {
        this.setActivities([]);
    }

    addActivities(activities: DetailedActivity[]) {
        this.setActivities(this.$activities().concat(activities));
    }

    private setActivities(activities: DetailedActivity[]) {
        this.state.$activities.set(activities);
        this.setFilteredActivities();
    }

    private setFilteredActivities() {
        this.state.$filteredActivities.set(this.applyFilters(this.$activities()));
    }

    private applyFilters(activities: DetailedActivity[]): DetailedActivity[] {
        const a = performance.now();
        console.debug('Filtering all activities, length ' + activities?.length);
        let filteredActivities = activities.filter(activity => {
            var should_include = true;
            const location = this.filterStore.$location();
            const radius = this.filterStore.$radius();
            if (location) {
                if (activity.map) {
                    let coordinateInRadius = decode(activity.map.summary_polyline).find((latlng) => {
                        let distanceBetweenPoints = location.distanceTo({
                            lat: latlng[0],
                            lng: latlng[1]
                        });
                        return distanceBetweenPoints < (radius ? radius.radius : 2000);
                    });
                    should_include = should_include && coordinateInRadius != undefined;
                } else {
                    should_include = false;
                }
            }
            return should_include;
        });
        const b = performance.now();
        console.debug('It took ' + (b - a) + ' ms.');
        return filteredActivities;
    }
}
