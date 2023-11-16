import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ActivitiesPageRoutingModule} from './activities-routing.module';

import {ActivitiesPage} from './activities.page';
import {ActivityComponentModule} from '../activity/activity.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesPageRoutingModule,
    ActivityComponentModule
  ],
  declarations: [ActivitiesPage]
})
export class ActivitiesPageModule {}
