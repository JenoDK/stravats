import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.jeno',
	appName: 'Stravats',
	webDir: 'www',
	server: {
		androidScheme: 'ionic',
		iosScheme: 'ionic',
		hostname: 'stravats',
	},
};

export default config;
