import {Component, Input, OnInit} from '@angular/core';
import {AthleteStats, CompleteAthlete} from '../model/strava';

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

  determineMainSport(stats: AthleteStats): string {
    const cyclingDistance = stats.recent_ride_totals.distance;
    const runningDistance = stats.recent_run_totals.distance;
    const workoutsDistance = stats.recent_swim_totals.distance;

    if (cyclingDistance >= runningDistance && cyclingDistance >= workoutsDistance) {
      return 'Cycling';
    } else if (runningDistance >= cyclingDistance && runningDistance >= workoutsDistance) {
      return 'Running';
    } else {
      return 'Workouts';
    }
  }

  getSportIcon(sport: string): string {
    switch (sport) {
      case 'ride':
        return 'bicycle-outline';
      case 'run':
        return 'walk-outline';
      case 'swim':
        return 'water-outline';
      default:
        return '';
    }
  }

  getSportDisplayName(sport: string): string {
    switch (sport) {
      case 'ride':
        return 'Cycling';
      case 'run':
        return 'Running';
      case 'swim':
        return 'Swimming';
      default:
        return '';
    }
  }

  getSports(): string[] {
    const sports = [];
    if (this.hasCyclingStats()) {
      sports.push('ride');
    }
    if (this.hasRunningStats()) {
      sports.push('run');
    }
    if (this.hasSwimmingStats()) {
      sports.push('swim');
    }
    return sports;
  }

  hasCyclingStats() {
    return this.completeAthlete.athlete_stats.all_ride_totals.distance > 0;
  }

  hasRunningStats() {
    return this.completeAthlete.athlete_stats.all_run_totals.distance > 0;
  }

  hasSwimmingStats() {
    return this.completeAthlete.athlete_stats.all_swim_totals.distance > 0;
  }
}
