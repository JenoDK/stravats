import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitiesPageRoutingModule } from './activities-routing.module';

import { ActivitiesPage } from './activities.page';
import { ActivityComponentModule } from '../activity/activity.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivityFilterMapComponentModule } from '../activity-filter-map/activity-filter-map.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ActivitiesPageRoutingModule,
		ActivityComponentModule,
		FontAwesomeModule,
		ActivityFilterMapComponentModule,
		ScrollingModule
	],
	declarations: [ActivitiesPage],
})
export class ActivitiesPageModule {
}
