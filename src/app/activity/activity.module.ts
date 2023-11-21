import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ActivityComponent } from './activity.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, RouterModule],
	declarations: [ActivityComponent],
	exports: [ActivityComponent],
})
export class ActivityComponentModule {}
