import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StravaConnectPageRoutingModule } from './strava-connect-routing.module';

import { StravaConnectPage } from './strava-connect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StravaConnectPageRoutingModule
  ],
  declarations: [StravaConnectPage]
})
export class StravaConnectPageModule {}
