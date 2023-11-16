import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StravaRedirectPageRoutingModule } from './strava-redirect-routing.module';

import { StravaRedirectPage } from './strava-redirect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StravaRedirectPageRoutingModule
  ],
  declarations: [StravaRedirectPage]
})
export class StravaRedirectPageModule {}
