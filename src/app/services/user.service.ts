import {Injectable} from '@angular/core';

export enum Role {
  ADMIN,
  USER,
  CUSTOMER
}

export class UserService {

  private username_: string;
  private readonly roles_: Role[] = [];
  private logged_: boolean;

  constructor() {
    this.checkLogin(localStorage.getItem('access'));
  }

  checkLogin(token: string) {
    if (token !== null) {
      this.logged_ = true;
      const parts = token.split('.');
      if (parts.length === 3) {
        const body = parts[0];

        const parsed: { exp: number, user_name: string, authorities: string[] } = JSON.parse(atob(body));
        this.logged_ = parsed.exp > (new Date().getTime() / 1000);
        this.username_ = parsed.user_name;
        parsed.authorities.forEach((role) => {
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
        });
      }
    } else {
      this.logged_ = false;
    }
  }

  public get username(): string {
    return this.username_;
  }

  public get roles(): Role[] {
    return this.roles_;
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
