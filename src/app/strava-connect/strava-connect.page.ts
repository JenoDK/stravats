import { Component, OnInit } from '@angular/core';
import {StravaAuthService} from '../services/strava-auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-strava-connect',
  templateUrl: './strava-connect.page.html',
  styleUrls: ['./strava-connect.page.scss'],
})
export class StravaConnectPage implements OnInit {

  constructor(
      private stravaAuthService: StravaAuthService,
      private router: Router
  ) { }

  ngOnInit() {
    if (this.stravaAuthService.isConnected()) {
      this.router.navigate(['/home'])
    }
  }

  connectWithStrava() {
    this.stravaAuthService.initCodeFlow();
  }
}
