import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondsToTimePipe } from './seconds-to-time.pipe';
import { RunningPaceFormatPipe } from './running-pace-format.pipe';

@NgModule({
	declarations: [SecondsToTimePipe, RunningPaceFormatPipe],
	exports: [SecondsToTimePipe, RunningPaceFormatPipe],
	imports: [CommonModule],
})
export class PipesModule {
}
