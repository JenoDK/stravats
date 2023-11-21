import { TestBed } from '@angular/core/testing';

import { StravaAthleteService } from './strava-athlete.service';

describe('StravaAthleteService', () => {
	let service: StravaAthleteService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StravaAthleteService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
