import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StravaRedirectPage } from './strava-redirect.page';

describe('StravaRedirectPage', () => {
  let component: StravaRedirectPage;
  let fixture: ComponentFixture<StravaRedirectPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StravaRedirectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
