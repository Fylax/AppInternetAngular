import {AfterViewInit, Component, Injector} from '@angular/core';
import {UserService} from "../services/user.service";
import {LoginService} from "./login.service";
import {FullScreenSpinnerService} from "../full-screen-spinner/full-screen-spinner.service";
import {ActivatedRoute, Router, RouterStateSnapshot} from "@angular/router";
import {catchError, first, retry} from "rxjs/operators";
import {throwError} from "rxjs";

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

  form = this.loginservice.form;

  /**
   * Whether the session has expired (meaning that refresh token is out of life).
   * This value is derived from query param.
   */
  expired: boolean;

  constructor(private loginservice: LoginService,
              private user: UserService,
              private spinner: FullScreenSpinnerService,
              private route: ActivatedRoute,
              private router: Router,
              private injector: Injector) {
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
    this.loginservice.login(this.form.get('username').value, this.form.get('password').value)
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
          // Loads from injector the Authentication Guard and reexecutes it, so that it redirects to correct user
          // homepage without requiring to code here (again) what homepage for each user is.
          const AuthGuard = this.route.snapshot.routeConfig.canActivate['0'];
          const authGuard = this.injector.get(AuthGuard);
          const routerStateSnapshot: RouterStateSnapshot = Object.assign({}, this.route.snapshot, {url: this.router.url});
          authGuard.canActivate(this.route.snapshot, routerStateSnapshot);
        });
  }

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }


}
