import {AfterViewInit, Component, Injector} from '@angular/core';
import {UserService} from "../services/user.service";
import {LoginService} from "./login.service";
import {FullScreenSpinnerService} from "../full-screen-spinner/full-screen-spinner.service";
import {ActivatedRoute, Router, RouterStateSnapshot} from "@angular/router";
import {catchError, first, retry} from "rxjs/operators";
import {throwError} from "rxjs";
import {LoginGuard} from "../app-routing/guards/authentication.guard";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {

  /**
   * Whether credentials are valid. Can be set to false with a REST request.
   */
  valid = true;

  /**
   * Whether the session has expired (meaning that refresh token is out of life).
   * This value is derived from query param.
   */
  expired: boolean;

  constructor(public service: LoginService,
              private user: UserService,
              private spinner: FullScreenSpinnerService,
              private route: ActivatedRoute,
              private router: Router,
              private guard: LoginGuard) {
    this.route.params.pipe(first())
        .subscribe((params) => {
          this.expired = params.session !== undefined;
        });
  }

  /**
   * Tries login. In case of success it redirects to user homepage, otherwise it shows an error message.
   */
  login() {
    this.spinner.showSpinner();
    // Tries login for tree times, managing errors.
    this.service.login(this.service.form.get('username').value, this.service.form.get('password').value)
        .pipe(
            first(),
            retry(3),
            catchError((error: Response) => {
              if (error.status === 400) {
                this.valid = false;
                this.spinner.hideSpinner();
                return throwError(error);
              }
            })
        )
        .subscribe((data) => {
          this.user.setTokens(data.access_token, data.refresh_token);
          this.guard.canLoad();
        });
  }

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }


}
