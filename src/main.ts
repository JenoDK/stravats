import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {addIcons} from 'ionicons';

if (environment.production) {
  enableProdMode();
}

addIcons({
  'strava': 'assets/icon/strava.svg',
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
