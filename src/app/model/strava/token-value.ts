import { SummaryAthlete } from './summary-athlete';

export interface TokenValue {
	expires_at: number;
	refresh_token: string;
	access_token: string;
	athlete: SummaryAthlete;
}
