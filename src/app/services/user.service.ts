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

  constructor() {
    this.checkLogin(localStorage.getItem('access'));
  }

  checkLogin(token: string) {
    if (token !== null) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const body = parts[1];
        const parsed: { exp: number, user_name: string, authorities: string[] } = JSON.parse(atob(body));

        this.exp_ = parsed.exp;
        this.username_ = parsed.user_name;
        for (const role of parsed.authorities) {
          switch (role) {
            case "ROLE_ADMIN":
              this.roles_.push(Role.ADMIN);
              break;
            case "ROLE_USER":
              this.roles_.push(Role.USER);
              break;
            case "ROLE_CUSTOMER":
              this.roles_.push(Role.CUSTOMER);
          }
        }
      }
    }
  }

  public get username(): string {
    return this.username_;
  }

  public get roles(): Role[] {
    return this.roles_;
  }

  public get isLogged(): boolean {
    return this.exp_ > (new Date().getTime() / 1000);
  }

}

@Injectable({
  providedIn: 'root'
})
export class UserTokenService extends UserService {

  private accessToken_: string;

  constructor() {
    super();
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken_ = accessToken;
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
    super.checkLogin(this.accessToken_);
  }

  public get accessToken() {
    return this.accessToken_;
  }

}
