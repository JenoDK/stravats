import { inject, Injectable, signal } from '@angular/core';
import { DetailedActivity } from '../model/strava';
import { distinctUntilChanged, filter, mergeMap, Observable, take, timer } from 'rxjs';
import { StravaActivitiesService } from '../services/strava-activities.service';
import { InfiniteScrollCustomEvent, RefresherCustomEvent } from '@ionic/angular';
import { decode } from 'google-polyline';
import { ActivitiesFilterStore } from './activities-filter-store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ActivitiesStore {
    private readonly stravaActivitiesService: StravaActivitiesService = inject(StravaActivitiesService);
    private readonly filterStore = inject(ActivitiesFilterStore);
    private readonly state = {
        $loading: signal<boolean>(false),
        $activities: signal<DetailedActivity[]>([]),
        $filteredActivities: signal<DetailedActivity[]>([]),
    } as const;

    public readonly $loading: Observable<boolean> = toObservable(this.state.$loading);
    public readonly $activities = this.state.$activities.asReadonly();
    public readonly $filteredActivities = this.state.$filteredActivities.asReadonly();

    private currentPage: number = 1;

    constructor() {
        this.stravaActivitiesService.isLoadingActivities.pipe(
            distinctUntilChanged(),
            takeUntilDestroyed()
        ).subscribe(isLoading => this.state.$loading.set(isLoading));
        timer(100).pipe(
            take(1),
            mergeMap(ignored => this.stravaActivitiesService.isFirstPageFetched),
        ).subscribe(firstPageIsFetched => {
            if (firstPageIsFetched) {
                this.loadRecentActivities(1);
                this.state.$loading.set(false);
            }
        });
        this.filterStore.$locationObs.pipe(
            filter(loc => !!loc),
            distinctUntilChanged(),
            takeUntilDestroyed()
        ).subscribe(loc => {
            this.state.$loading.set(true);
            this.state.$activities.set(this.stravaActivitiesService.getAllStoredActivities().filter(activity => {
                var should_include = true;
                const location = this.filterStore.$location();
                if (location) {
                    if (activity.map) {
                        let coordinateIn5KmRadiusOfPosition = decode(activity.map.summary_polyline).find((latlng) => {
                            let distanceBetweenPoints = location.distanceTo({
                                lat: latlng[0],
                                lng: latlng[1]
                            });
                            return distanceBetweenPoints < 2000;
                        });
                        should_include = should_include && coordinateIn5KmRadiusOfPosition != undefined;
                    } else {
                        should_include = false;
                    }
                }
                return should_include;
            }));
            this.state.$loading.set(false);
        })
    }

    fetchNextPage($event: any) {
        if ($event) {
            ($event as InfiniteScrollCustomEvent).target.complete();
        }
        // this.currentPage++;
        // this.loadRecentActivities(
        //     this.currentPage,
        //     () => {
        //         if ($event) {
        //             ($event as InfiniteScrollCustomEvent).target.complete();
        //         }
        //     },
        // );
    }

    refresh(ev: any) {
        this.stravaActivitiesService.hasNewActivities().subscribe(hasNewActivities => {
            if (hasNewActivities) {
                this.reset();
                this.stravaActivitiesService.reloadAllActivities();
            }
            (ev as RefresherCustomEvent).detail.complete();
        })
    }

    private loadRecentActivities(page: number, callback: Function = () => {
    }) {
        const storedActivities = this.stravaActivitiesService.getStoredActivities(page);
        if (storedActivities && !storedActivities.every((value) => this.$activities().includes(value))) {
            this.state.$activities.set(this.$activities().concat(storedActivities));
        }
        callback();
    }

    private reset() {
        this.state.$activities.set([]);
        this.state.$filteredActivities.set([]);
    }

}
