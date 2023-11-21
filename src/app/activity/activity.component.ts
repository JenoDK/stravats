import { Component, inject, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Message } from '../services/data.service';

@Component({
	selector: 'app-activity',
	templateUrl: './activity.component.html',
	styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent {
	private platform = inject(Platform);
	@Input() activity?: Message;

	isIos() {
		return this.platform.is('ios');
	}
}
