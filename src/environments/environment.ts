// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	stravaBaseUrl: 'https://www.strava.com/api/v3',
	stravaOAuth: {
		clientId: '{{ clientId }}',
		redirectUri: 'http://localhost:4200',
		issuer: 'https://www.strava.com',
		scope: 'activity:read_all,profile:read_all',
		responseType: 'code',
		loginUrl: 'https://www.strava.com/oauth/authorize',
		oidc: false,
		tokenEndpoint: 'https://www.strava.com/oauth/token',
		clientSecret: '{{ clientSecret }}',
		showDebugInformation: false,
		logoutUrl: 'https://www.strava.com/oauth/deauthorize',
		revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
