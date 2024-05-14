import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppLauncher } from '@capacitor/app-launcher';
import { environment } from '../../environments/environment';
import { TokenValue } from '../model/strava/token-value';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { handleError } from '../common/Utils';

export const STRAVA_TOKEN_VALUE_STORAGE_KEY = 'strava_token_value';

@Injectable({
	providedIn: 'root',
})
export class StravaAuthService {
	private isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject(
		false,
	);
	public isAuthenticated = this.isAuthenticated$.asObservable();

	private token$: BehaviorSubject<TokenValue | null> =
		new BehaviorSubject<TokenValue | null>(null);
	public token = this.token$.asObservable();

	private http = inject(HttpClient);
	private router = inject(Router);

	constructor() {
		if (this.userIsAuthenticated()) {
			this.setAuthenticatedUser(this.getTokenFromLocalStorage());
		}
	}

	userIsAuthenticated(): boolean {
		let tokenValue: TokenValue = this.getTokenFromLocalStorage();
		return tokenValue != null && !this.isTokenExpired(tokenValue);
	}

	isTokenExpired(token: TokenValue): boolean {
		const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
		return token.expires_at < currentTimestamp;
	}

	getTokenFromLocalStorage(): TokenValue | null {
		const tokenString = localStorage.getItem(
			STRAVA_TOKEN_VALUE_STORAGE_KEY,
		);

		if (tokenString) {
			try {
				return JSON.parse(tokenString);
			} catch (error) {
				console.error('Error parsing token from local storage:', error);
				return null;
			}
		}

		return null;
	}

	public initCodeFlow() {
		if (
			Capacitor.getPlatform() === 'ios' ||
			Capacitor.getPlatform() === 'android'
		) {
			console.log('Can run from ' + Capacitor.getPlatform);
			const startStravaOAuthFlow = async () => {
				const canOpenApp = await AppLauncher.canOpenUrl({
					url: 'strava://',
				});
				const redirectUri = `${window.location.origin}/redirect/exchange_token`;
				console.log(`${redirectUri}`);
				if (canOpenApp.value) {
					const authorizationUrlApp = `strava://oauth/mobile/authorize?client_id=${environment.stravaOAuth.clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${environment.stravaOAuth.scope}`;
					// If the Strava app is installed, attempt to open it
					return AppLauncher.openUrl({ url: authorizationUrlApp });
				} else {
					const authorizationUrl = `https://www.strava.com/oauth/mobile/authorize?client_id=${environment.stravaOAuth.clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${environment.stravaOAuth.scope}`;
					// If the Strava app is not installed, open the authorization URL in the browser
					return Browser.open({ url: authorizationUrl });
				}
			};
			startStravaOAuthFlow()
				.then(() => {
					console.log('OAuth flow started successfully.');
				})
				.catch((error) => {
					console.error('Error starting OAuth flow:', error);
				});
		} else {
			console.log('Opening window');
			window.location.replace(
				`https://www.strava.com/oauth/authorize?client_id=${environment.stravaOAuth.clientId}&response_type=code&redirect_uri=${environment.stravaOAuth.redirectUri}/redirect/exchange_token&approval_prompt=force&scope=${environment.stravaOAuth.scope}`,
			);
		}
	}

	public getAccessToken(code: string, loading: HTMLIonLoadingElement) {
		const payload = {
			client_id: environment.stravaOAuth.clientId,
			client_secret: environment.stravaOAuth.clientSecret,
			grant_type: 'authorization_code',
			code: code,
		};
		this.http
			.post<TokenValue>(
				'https://www.strava.com/api/v3/oauth/token',
				payload,
			)
			.subscribe({
				next: (response) => {
					this.setAuthenticatedUser(response);
					loading.dismiss();
				},
				error: (e) => {
					handleError(e);
					loading.dismiss();
				},
				complete: () => console.info('complete'),
			});
	}

	public setAuthenticatedUser(token: TokenValue) {
		this.isAuthenticated$.next(true);
		localStorage.setItem(
			STRAVA_TOKEN_VALUE_STORAGE_KEY,
			JSON.stringify(token),
		);
		this.token$.next(token);
		this.router.navigate(['/activities']);
	}

	public clearAuthenticatedUser() {
		this.isAuthenticated$.next(false);
		localStorage.removeItem(STRAVA_TOKEN_VALUE_STORAGE_KEY);
		this.token$.next(null);
		this.router.navigate(['/connect']);
	}
}
