import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StravaRedirectPage } from './strava-redirect.page';

const routes: Routes = [
  {
    path: '',
    component: StravaRedirectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StravaRedirectPageRoutingModule {}
