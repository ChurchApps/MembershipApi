// Long lived access and refresh tokens for userChurch/client pairs
export class OAuthToken {
  public id?: string;
  public clientId?: string;
  public userChurchId?: string;
  public accessToken?: string;
  public refreshToken?: string;
  public scopes?: string;
  public expiresAt?: Date;
  public createdAt?: Date;
}
