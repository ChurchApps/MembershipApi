// Long lived access and refresh tokens for userChurch/client pairs
export class OAuthToken {
  public id?: string;
  public clientId?: string;
  public userChurchId?: string;
  public accessToken?: string;
  public refreshToken?: string;
  public scopes?: string;
  public accessTokenExpiresAt?: Date;
  public refreshTokenExpiresAt?: Date;
  public createdAt?: Date;
}

