import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StravaAuthService} from '../services/strava-auth.service';

@Component({
  selector: 'app-strava-redirect',
  templateUrl: './strava-redirect.page.html',
  styleUrls: ['./strava-redirect.page.scss'],
})
export class StravaRedirectPage implements OnInit {

  constructor(
      private route: ActivatedRoute,
      private stravaAuthService: StravaAuthService
  ) { }

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code != null) {
        this.stravaAuthService.getAccessToken(code);
    }
  }

}
