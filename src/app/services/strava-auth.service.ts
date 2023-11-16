import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {TokenValue} from '../model/strava/token-value';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class StravaAuthService {

    public readonly strava_token_storage_key = "strava_token";

    private isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isAuthenticated = this.isAuthenticated$.asObservable();

    private token$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)
    public token = this.token$.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {

        const tokenFromStorage = localStorage.getItem(this.strava_token_storage_key);
        if (tokenFromStorage) {
            this.setAuthenticatedUser(tokenFromStorage)
        }
    }

    isConnected(): boolean {
        return localStorage.getItem(this.strava_token_storage_key) != null;
    }

    public initCodeFlow() {
        window.location.replace(`https://www.strava.com/oauth/authorize?client_id=${environment.stravaOAuth.clientId}&response_type=code&redirect_uri=${environment.stravaOAuth.redirectUri}/redirect/exchange_token&approval_prompt=force&scope=${environment.stravaOAuth.scope}`);
    }

    public getAccessToken(code: string) {
        const payload = {
            'client_id': environment.stravaOAuth.clientId,
            'client_secret': environment.stravaOAuth.clientSecret,
            'grant_type': 'authorization_code',
            'code': code} ;
        this.http.post<TokenValue>('https://www.strava.com/api/v3/oauth/token', payload).pipe(
            catchError(this.handleError)
        ).subscribe((response) => {
            this.setAuthenticatedUser(response.access_token);
        });
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError('Something bad happened; please try again later.');
    }

    public setAuthenticatedUser(token: string) {
        this.isAuthenticated$.next(true);
        localStorage.setItem(this.strava_token_storage_key, token);
        this.token$.next(token);
        this.router.navigate(['/home']);
    }

    public clearAuthenticatedUser() {
        this.isAuthenticated$.next(false);
        localStorage.removeItem(this.strava_token_storage_key);
        this.token$.next(null);
    }
}
