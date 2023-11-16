import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityViewPage } from './activity-view.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityViewPageRoutingModule {}
