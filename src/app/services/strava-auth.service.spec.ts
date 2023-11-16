import { TestBed } from '@angular/core/testing';

import { StravaAuthService } from './strava-auth.service';

describe('StravaAuthService', () => {
	let service: StravaAuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StravaAuthService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
