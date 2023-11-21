import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ActivityType } from '../model/strava/enums';

export function getSportIcon(sport: string): string {
	switch (sport) {
		case 'ride':
			return 'bicycle-outline';
		case 'run':
			return 'walk-outline';
		case 'swim':
			return 'water-outline';
		default:
			return '';
	}
}

export function getActivityIcon(sport: ActivityType): string {
	switch (sport) {
		case ActivityType.Ride:
		case ActivityType.VirtualRide:
			return 'bicycle-outline';
		case ActivityType.Run:
		case ActivityType.Walk:
			return 'walk-outline';
		case ActivityType.Swim:
			return 'water-outline';
		case ActivityType.Workout:
		case ActivityType.WeightTraining:
			return 'barbell-outline';
		default:
			return '';
	}
}

export function handleError(error: HttpErrorResponse) {
	if (error.error instanceof ErrorEvent) {
		// A client-side or network error occurred. Handle it accordingly.
		console.error('An error occurred:', error.error.message);
	} else {
		// The backend returned an unsuccessful response code.
		// The response body may contain clues as to what went wrong.
		console.error(
			`Backend returned code ${error.status}, body was: ${error.error}`,
		);
	}
	// Return an observable with a user-facing error message.
	return throwError(
		() => new Error('Something bad happened; please try again later.'),
	);
}
