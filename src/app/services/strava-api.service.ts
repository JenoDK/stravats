import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {StravaAuthService} from './strava-auth.service';
import {Router} from '@angular/router';
import {catchError, map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StravaApiService {
  private apiUrl = 'https://www.strava.com/api/v3'; // Strava API base URL

  private http = inject(HttpClient);
  private router = inject(Router);
  private stravaAuthService = inject(StravaAuthService);

  constructor() {}

  private getHeaders(): HttpHeaders {
    if (this.stravaAuthService.userIsAuthenticated()) {
      const accessToken = this.stravaAuthService.getTokenFromLocalStorage().access_token;
      return new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
    } else {
      this.router.navigate(['/connect']);
      return new HttpHeaders({});
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Strava API error:', error);

    // You can customize error handling based on your requirements
    let errorMessage = 'An error occurred. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      // Unauthorized error (e.g., invalid access token)
      errorMessage = 'Unauthorized. Please check your authentication.';
    } else if (error.status === 403) {
      // Forbidden error (e.g., insufficient permissions)
      errorMessage = 'Forbidden. You do not have permission to access this resource.';
    }

    return throwError(() => new Error(errorMessage))
  }

  // Generic method to perform Strava API requests
  // T represents the expected response type
  public request<T>(method: string, endpoint: string, options?: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = this.getHeaders();

    // Adjust the return type to handle HttpEvent<T>
    return this.http.request<T>(method, url, { headers, ...options })
        .pipe(
            map(e => e as T),
            catchError(this.handleError)
        );
  }
}
