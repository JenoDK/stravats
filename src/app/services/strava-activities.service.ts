import { inject, Injectable } from '@angular/core';
import { StravaApiService } from './strava-api.service';
import { filter, map, Observable, of } from 'rxjs';
import { DetailedActivity } from '../model/strava';
import { StravaAuthService } from './strava-auth.service';
import { ActivitiesStore } from '../stores/activities-store';
import { RefresherCustomEvent } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class StravaActivitiesService {
    private readonly stravaAuthService: StravaAuthService = inject(StravaAuthService);
    private readonly activitiesStore: ActivitiesStore = inject(ActivitiesStore);
    private readonly perPageSize = 50;

    constructor(private stravaApiService: StravaApiService) {
        this.stravaAuthService.isAuthenticated.pipe(
            filter(isAuthenticated => isAuthenticated)
        ).subscribe(() => {
            this.loadAllActivities();
        });
    }

    loadAllActivities() {
        this.activitiesStore.isLoading(true);
        this.hasNewActivities()
            .subscribe(hasNewActivities => {
                // If we have new activities, we restart the fetch completely. We can try to be smart but this is fine.
                if (hasNewActivities) {
                    this.reloadAllActivities();
                } else {
                    this.isNotDoneFetching()
                        .subscribe({
                            // If not all activities are fetched yet, continue fetching. This could be because the user aborted the fetches because the app was closed f.e.
                            next: (isNotDone) => {
                                if (isNotDone) {
                                    this.loadActivitiesRecursive(this.getStoredActivitiesLastPage());
                                } else {
                                    this.finishLoading();
                                    this.activitiesStore.addActivities(this.getAllStoredActivities());
                                }
                            },
                            error: () => {
                                this.finishLoading();
                            },
                            complete: () => console.info('complete'),
                        })
                }
            })
    }

    reloadAllActivities() {
        this.clearStoredActivities();
        this.loadActivitiesRecursive(1);
    }

    refresh(ev: any) {
        this.hasNewActivities().subscribe({
            next: (hasNewActivities) => {
                if (hasNewActivities) {
                    this.activitiesStore.reset();
                    this.reloadAllActivities();
                }
                (ev as RefresherCustomEvent).detail.complete();
            },
            error: () => {
                (ev as RefresherCustomEvent).detail.complete();
            },
        });
    }

    /**
     * Will fetch the most recent activity and check if it's in the localStorgae
     */
    hasNewActivities(): Observable<boolean> {
        const storedActivities = this.getStoredActivities(1);
        if (storedActivities) {
            return this.getActivities(1, 1)
                .pipe(
                    map((activities: DetailedActivity[]) => activities && activities.length > 0 && storedActivities.findIndex((value) => value.id === activities[0].id) === -1)
                );
        } else {
            return of(true);
        }
    }

    /**
     * Will try a fetch of the last page found in localStorage + 1 and returns true if elements are found
     */
    isNotDoneFetching(): Observable<boolean> {
        const storedActivities = this.getStoredActivities(1);
        if (storedActivities) {
            const lastFetchedPage = this.getStoredActivitiesLastPage();
            return this.getActivities(lastFetchedPage, this.perPageSize)
                .pipe(
                    map((activities: DetailedActivity[]) => activities && activities.length > 0)
                );
        } else {
            return of(true);
        }
    }

    getActivities(
        page: number,
        perPage: number,
    ): Observable<DetailedActivity[]> {
        const endpoint = `athlete/activities`;
        const options = {
            params: {
                page: page.toString(),
                per_page: perPage.toString(),
            },
        };
        return this.stravaApiService.request<DetailedActivity[]>(
            'GET',
            endpoint,
            options,
        );
    }

    private loadActivitiesRecursive(page: number): void {
        this.getActivities(page, this.perPageSize)
            .subscribe({
                next: (avs: DetailedActivity[]) => {
                    if (avs.length > 0) {
                        this.storeActivities(page, avs);
                        // Load the next page
                        this.loadActivitiesRecursive(page + 1);
                    } else {
                        this.finishLoading();
                    }
                },
                error: (error) => {
                    console.error('Error loading activities:', error);
                },
            });
    }

    private finishLoading() {
        this.activitiesStore.isLoading(false);
    }

    private storeActivities(page: number, activities: DetailedActivity[]) {
        // Store activities in localStorage
        localStorage.setItem(
            `activities_page_${page}`,
            JSON.stringify(activities),
        );
        this.activitiesStore.addActivities(activities);
    }

    getAllStoredActivities(): DetailedActivity[] | null {
        let page = 1;
        let activities: DetailedActivity[] = [];
        while (localStorage.getItem(`activities_page_${page}`)) {
            activities = activities.concat(this.getStoredActivities(page));
            page++;
        }
        return activities;
    }

    getStoredActivities(page: number): DetailedActivity[] | null {
        // Retrieve activities from localStorage
        const storedActivities = localStorage.getItem(
            `activities_page_${page}`,
        );
        return storedActivities ? JSON.parse(storedActivities) : null;
    }

    private getStoredActivitiesLastPage(): number {
        let page = 1;
        while (localStorage.getItem(`activities_page_${page}`)) {
            page++;
        }
        return page;
    }

    private clearStoredActivities() {
        // Clear all activities in store
        this.activitiesStore.reset();
        // Clear all stored activities in localStorage
        let page = 1;
        let removed = false;

        while (page <= 99999) {
            const key = `activities_page_${page}`;
            const storedActivities = localStorage.getItem(key);

            if (storedActivities) {
                localStorage.removeItem(key);
                removed = true;
            } else {
                // Break the loop if no item is found
                break;
            }

            page++;
        }

        if (removed) {
            console.log('Stored activities cleared successfully.');
        } else {
            console.log('No stored activities found to clear.');
        }
    }

}
