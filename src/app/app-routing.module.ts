import {inject, NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './guard/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [() => inject(AuthGuardService).canContinue()]
  },
  {
    path: 'activities',
    loadChildren: () => import('./activities/activities.module').then( m => m.ActivitiesPageModule),
    canActivate: [() => inject(AuthGuardService).canContinue()]
  },
  {
    path: 'activity/:id',
    loadChildren: () => import('./activity-view/activity-view.module').then( m => m.ActivityViewPageModule),
    canActivate: [() => inject(AuthGuardService).canContinue()]
  },
  {
    path: 'connect',
    loadChildren: () => import('./strava-connect/strava-connect.module').then(m => m.StravaConnectPageModule)
  },
  {
    path: 'redirect/exchange_token',
    loadChildren: () => import('./strava-redirect/strava-redirect.module').then( m => m.StravaRedirectPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
