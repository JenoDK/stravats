import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ActivityFilterMapComponent } from './activity-filter-map.component';
import { Directives } from '../directives';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule],
	declarations: [ActivityFilterMapComponent, ...Directives],
	exports: [ActivityFilterMapComponent],
})
export class ActivityFilterMapComponentModule {
}
