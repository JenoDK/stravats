import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivityFilterMapComponent } from './activity-filter-map.component';

describe('ActivityFilterComponent', () => {
	let component: ActivityFilterMapComponent;
	let fixture: ComponentFixture<ActivityFilterMapComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ActivityFilterMapComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(ActivityFilterMapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
