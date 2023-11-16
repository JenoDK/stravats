import {inject, NgModule} from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from './guard/auth-guard.service';
import {StravaConnectPageModule} from './strava-connect/strava-connect.module';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [() => inject(AuthGuardService).canContinue()]
  },
  {
    path: 'message/:id',
    loadChildren: () => import('./view-message/view-message.module').then( m => m.ViewMessagePageModule)
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
