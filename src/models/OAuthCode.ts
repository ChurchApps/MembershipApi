// Temp request to get an access token
export class OAuthCode {
  public id?: string;
  public userChurchId?: string;
  public clientId?: string;
  public code?: string;
  public redirectUri?: string;
  public expiresAt?: Date;
  public scopes?: string;
  public createdAt?: Date;
}
