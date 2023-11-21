import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { StravaAuthService } from '../services/strava-auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuardService {
	constructor(
		private stravaAuthService: StravaAuthService,
		private router: Router,
	) {}

	canContinue(): boolean | UrlTree {
		if (this.stravaAuthService.userIsAuthenticated()) {
			return true;
		} else {
			return this.router.createUrlTree(['connect']);
		}
	}
}
