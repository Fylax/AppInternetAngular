import {Injectable} from '@angular/core';

export enum Role {
  ADMIN,
  USER,
  CUSTOMER
}

export class UserService {

  private username_: string;
  private readonly roles_: Role[] = [];
  private exp_ = 0;

  constructor(accessToken?: string) {
    if (accessToken !== null) {
      this.checkLogin(accessToken);
    }
  }

  public get isLogged(): boolean {
    return this.username_ !== undefined && this.exp_ > new Date().getTime();
  }

  public get username(): string {
    return this.username_;
  }

  public get roles(): Role[] {
    return this.roles_;
  }

  public hasRole(role: Role) {
    return this.roles_.includes(role);
  }

  protected parseToken(token: string): { exp: number, user_name: string, authorities: string[] } | null {
    if (token !== null) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const body = parts[1];
        return JSON.parse(atob(body));
      }
    }
    return null;
  }

  protected checkLogin(token: string) {
    const parsed = this.parseToken(token);
    this.exp_ = parsed.exp * 1000;
    this.username_ = parsed.user_name;
    for (const role of parsed.authorities) {
      switch (role) {
        case 'ROLE_ADMIN':
          this.roles_.push(Role.ADMIN);
          break;
        case 'ROLE_USER':
          this.roles_.push(Role.USER);
          break;
        case 'ROLE_CUSTOMER':
          this.roles_.push(Role.CUSTOMER);
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserTokenService extends UserService {

  private accessToken_: string;
  private refreshExp_ = 0;

  constructor() {
    super(localStorage.getItem('access'));
    this.accessToken_ = localStorage.getItem('access');
    if (this.accessToken_ !== null) {
      const parsed = super.parseToken(this.refreshToken);
      this.refreshExp_ = parsed.exp * 1000;
    }
  }

  public get isRefreshTokenExpired(): boolean {
    return this.refreshExp_ < (new Date().getTime());
  }

  public get accessToken(): string {
    return this.accessToken_;
  }

  public get refreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken_ = accessToken;
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
    super.checkLogin(this.accessToken_);
    const parsed = super.parseToken(refreshToken);
    this.refreshExp_ = parsed.exp * 1000;
  }

}
