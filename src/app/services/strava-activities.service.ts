import { Injectable } from '@angular/core';
import { StravaApiService } from './strava-api.service';
import { Observable } from 'rxjs';
import { DetailedActivity } from '../model/strava';

@Injectable({
	providedIn: 'root',
})
export class StravaActivitiesService {
	constructor(private stravaApiService: StravaApiService) {}

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
}
