import {AfterViewInit, Component, Injector} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {UserTokenService} from "../../services/user.service";
import {LoginService} from "../../services/login.service";
import {SpinnerService} from "../../services/spinner.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router, RouterStateSnapshot} from "@angular/router";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {

  valid = true;

  username = new FormControl('', {
    updateOn: 'blur',
    validators: [
      Validators.required
    ]
  });

  password = new FormControl('', {
    updateOn: 'change',
    validators: [
      Validators.required
    ]
  });

  constructor(private loginservice: LoginService,
              private user: UserTokenService,
              private spinner: SpinnerService,
              private route: ActivatedRoute,
              private router: Router,
              private injector: Injector) {
  }

  login() {
    this.spinner.showSpinner();
    this.loginservice.login(this.username.value, this.password.value)
        .pipe(
            tap((data) => {
              this.user.setTokens(data.access_token, data.refresh_token);
              const curr_route = this.route.root.children['0'];
              const AuthGuard = curr_route.snapshot.routeConfig.canActivate['0'];
              const authGuard = this.injector.get(AuthGuard);
              const routerStateSnapshot: RouterStateSnapshot = Object.assign({}, curr_route.snapshot, {url: this.router.url});
              authGuard.canActivate(curr_route.snapshot, routerStateSnapshot);
            }),
            catchError((error: Response) => {
              if (error.status === 400) {
                this.valid = false;
                this.spinner.hideSpinner();
                return throwError(error);
              }
            })
        );
  }

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }


}
