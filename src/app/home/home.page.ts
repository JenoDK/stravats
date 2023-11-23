import { Component, OnInit } from '@angular/core';
import { StravaAthleteService } from '../services/strava-athlete.service';
import { CompleteAthlete, DetailedAthlete } from '../model/strava';
import { filter, mergeMap, Observable } from 'rxjs';
import { StravaAuthService } from '../services/strava-auth.service';
import { StravaActivitiesService } from '../services/strava-activities.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	completeAthlete: Observable<CompleteAthlete>;

	constructor(
		private stravaAthleteService: StravaAthleteService,
		private stravaAuthService: StravaAuthService,
		private stravaActivitiesService: StravaActivitiesService
	) {
		this.completeAthlete = this.stravaAthleteService
			.getAthleteDetails()
			.pipe(
				mergeMap((athlete: DetailedAthlete) =>
					this.stravaAthleteService.getAthleteStats(athlete.id).pipe(
						// Combine the results into a single object
						mergeMap((athleteStats) => {
							const completeAthlete = {
								athlete,
								athlete_stats: athleteStats,
							};
							return [completeAthlete];
						}),
					),
				),
			);
	}

	ngOnInit(): void {
        this.stravaAuthService.isAuthenticated.pipe(
			filter(isAuthenticated => isAuthenticated)
		).subscribe(() => {
			this.stravaActivitiesService.loadAllActivities();
		});
    }
}
