export interface Athlete {
    id: number,
    username: string,
    firstname: string,
    lastname: string,
    profile: string,
}

export interface TokenValue {
    expires_at: number,
    refresh_token: string,
    access_token: string,
    athlete: Athlete
}
