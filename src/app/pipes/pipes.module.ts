import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondsToTimePipe } from './seconds-to-time.pipe';

@NgModule({
	declarations: [SecondsToTimePipe],
	exports: [SecondsToTimePipe],
	imports: [CommonModule],
})
export class PipesModule {}
