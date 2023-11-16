import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ActivitiesPage} from './activities.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesPageRoutingModule {}
