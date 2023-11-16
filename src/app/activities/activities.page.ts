import {Component, inject, OnInit} from '@angular/core';
import {DataService, Message} from '../services/data.service';
import {RefresherCustomEvent} from '@ionic/angular';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.page.html',
    styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {

    private data = inject(DataService);

    constructor() {
    }

    refresh(ev: any) {
        setTimeout(() => {
            (ev as RefresherCustomEvent).detail.complete();
        }, 3000);
    }

    getMessages(): Message[] {
        return this.data.getMessages();
    }

    ngOnInit(): void {
    }

}
