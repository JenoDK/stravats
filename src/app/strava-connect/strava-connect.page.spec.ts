import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StravaConnectPage } from './strava-connect.page';

describe('StravaConnectPage', () => {
	let component: StravaConnectPage;
	let fixture: ComponentFixture<StravaConnectPage>;

	beforeEach(async(() => {
		fixture = TestBed.createComponent(StravaConnectPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
