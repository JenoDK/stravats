import {Component, inject, OnInit} from '@angular/core';
import {DataService, Message} from '../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.page.html',
  styleUrls: ['./activity-view.page.scss'],
})
export class ActivityViewPage implements OnInit {

  public activity!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);

  constructor() {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.activity = this.data.getMessageById(parseInt(id, 10));
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Activities' : '';
  }

}
