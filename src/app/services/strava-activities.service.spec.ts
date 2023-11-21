import { TestBed } from '@angular/core/testing';

import { StravaActivitiesService } from './strava-activities.service';

describe('StravaActivitiesService', () => {
	let service: StravaActivitiesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StravaActivitiesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
