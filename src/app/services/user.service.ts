import {Injectable} from '@angular/core';

export enum Role {
  USER
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * Username.
   */
  private username_: string;
  /**
   * List of Roles associated with curent user.
   * Currently only _USER_ role is supported.
   */
  private readonly roles_: Role[] = [];
  /**
   * Access token expiration timestamp. Initially set to 0 to ensure that it is expired at bootstrap.
   */
  private exp_ = 0;
  /**
   * Access token saved in a field (together with `localStorage`) for performance reasons.
   */
  private accessToken_: string;
  /**
   * Refresh token expiration timestamp. Initially set to 0 to ensure that it is expired at bootstrap.
   */
  private refreshExp_ = 0;

  /**
   * Invoked once at bootstrap (singleton service). Checks in `localStorage` if user was previously
   * logged by looking in localStorage and, in the affirmative case, populates the object.
   */
  constructor() {
    this.accessToken_ = localStorage.getItem('access');
    if (this.accessToken_ !== null) {
      this.checkLogin(this.accessToken_);
    }
  }

  /**
   * Fetches the refresh token from `localStorage`.
   * @returns Refresh Token if available, or null.
   */
  public static get refreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  /**
   * Deserializes a JSON Web Token.
   * @param token JWT to deserialize.
   * @returns Deserialized data.
   */
  private static parseToken(token: string): { exp: number, user_name: string, authorities: string[] } | null {
    if (token !== null) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const body = parts[1];
        return JSON.parse(atob(body));
      }
    }
    return null;
  }

  /**
   * Perform user logout.
   */
  public logout() {
    localStorage.clear();
    this.username_ = undefined;
    this.exp_ = 0;
  }

  /**
   * @returns Access token.
   */
  public get accessToken(): string {
    return this.accessToken_;
  }

  /**
   * @returns Whether the user is logged.
   */
  public get isLogged(): boolean {
    return this.username_ !== undefined && this.exp_ > new Date().getTime();
  }

  /**
   * @returns Username
   */
  public get username(): string {
    return this.username_;
  }

  /**
   * @returns Whether the refresh token is expired.
   */
  public get isRefreshTokenExpired(): boolean {
    return this.refreshExp_ < (new Date().getTime());
  }

  /**
   * @returns List of roles available for current user.
   */
  public get roles(): Role[] {
    return this.roles_;
  }

  /**
   * Loads in localStorage, for future reuse, both access and refresh token.
   * @param accessToken Access token to be stored.
   * @param refreshToken Refresh token to be stored.
   */
  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken_ = accessToken;
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
    this.checkLogin(this.accessToken_);
    const parsed = UserService.parseToken(refreshToken);
    this.refreshExp_ = parsed.exp * 1000;
  }

  private checkLogin(token: string) {
    const parsed = UserService.parseToken(token);
    this.exp_ = parsed.exp * 1000;
    this.username_ = parsed.user_name;
    for (const role of parsed.authorities) {
      switch (role) {
        case 'ROLE_USER':
          this.roles_.push(Role.USER);
      }
    }
  }


}
