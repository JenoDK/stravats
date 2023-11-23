import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'runningPaceFormat'
})
export class RunningPaceFormatPipe implements PipeTransform {

	transform(speed: number): string {
		const paceInMinutes = 60 / speed; // Convert speed to minutes per kilometer
		const minutes = Math.floor(paceInMinutes);
		const seconds = Math.round((paceInMinutes - minutes) * 60);
		const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${paddedSeconds} min/km`;
	}

}
