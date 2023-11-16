import {Component, Input, OnInit} from '@angular/core';
import {CompleteAthlete} from '../model/strava';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    @Input() public completeAthlete: CompleteAthlete;

    constructor() {
    }

    ngOnInit(): void {
    }

}
