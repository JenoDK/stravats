import { Injectable } from '@angular/core';
import { AthleteStats, DetailedAthlete } from '../model/strava';
import { Observable } from 'rxjs';
import { StravaApiService } from './strava-api.service';

@Injectable({
	providedIn: 'root',
})
export class StravaAthleteService {
	constructor(private stravaApi: StravaApiService) {}

	getAthleteDetails(): Observable<DetailedAthlete> {
		return this.stravaApi.request<DetailedAthlete>('GET', 'athlete');
	}

	getAthleteStats(athleteId: number): Observable<AthleteStats> {
		return this.stravaApi.request<AthleteStats>(
			'GET',
			`athletes/${athleteId}/stats`,
		);
	}
}
