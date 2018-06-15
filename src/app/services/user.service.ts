import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

export enum Role {
    ADMIN,
    USER,
    CUSTOMER
}

export class UserService {

    private username_: string;
    private readonly roles_: Role[] = [];
    protected exp_ = 0;

    constructor() {
        this.checkLogin(localStorage.getItem('access'));
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

    checkLogin(token: string) {
        if (token !== null) {
            const parts = token.split('.');
            if (parts.length === 3) {
                const body = parts[1];
                const parsed: { exp: number, user_name: string, authorities: string[] } = JSON.parse(atob(body));

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
    }

}

@Injectable({
    providedIn: 'root'
})
export class UserTokenService extends UserService {

    private accessToken_: string;

    constructor() {
        super();
        this.accessToken_ = localStorage.getItem('access');
    }

    public setTokens(accessToken: string, refreshToken: string) {
        this.accessToken_ = accessToken;
        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', refreshToken);
        super.checkLogin(this.accessToken_);
    }

    public get isTokenExpired(): boolean {
        return this.exp_ < (new Date().getTime());
    }

    public get accessToken(): string {
        return this.accessToken_;
    }

    public get refreshToken(): string | null {
        return localStorage.getItem('refresh');
    }

}
