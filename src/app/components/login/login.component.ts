import {AfterViewInit, Component, Injector} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserTokenService} from "../../services/user.service";
import {LoginService} from "../../services/login.service";
import {SpinnerService} from "../../services/spinner.service";
import {ActivatedRoute, Router, RouterStateSnapshot} from "@angular/router";
import {catchError, first} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {

  valid = true;

  form = new FormGroup({
    username: new FormControl('', {
      updateOn: 'blur',
      validators: [
        Validators.required
      ]
    }),
    password: new FormControl('', {
      updateOn: 'change',
      validators: [
        Validators.required
      ]
    })
  });

  expired: boolean;

  constructor(private loginservice: LoginService,
              private user: UserTokenService,
              private spinner: SpinnerService,
              private route: ActivatedRoute,
              private router: Router,
              private injector: Injector) {
    this.route.params.pipe(first())
        .subscribe((params) => {
          this.expired = params.session !== undefined;
        });
  }

  login() {
    this.spinner.showSpinner();
    this.loginservice.login(this.form.get('username').value, this.form.get('password').value)
        .pipe(
            first(),
            catchError((error: Response) => {
              if (error.status === 400) {
                this.valid = false;
                this.spinner.hideSpinner();
                return throwError(error);
              }
            })
        ).subscribe((data) => {
      this.user.setTokens(data.access_token, data.refresh_token);
      const curr_route = this.route.root.children['0'];
      const AuthGuard = curr_route.snapshot.routeConfig.canActivate['0'];
      const authGuard = this.injector.get(AuthGuard);
      const routerStateSnapshot: RouterStateSnapshot = Object.assign({}, curr_route.snapshot, {url: this.router.url});
      authGuard.canActivate(curr_route.snapshot, routerStateSnapshot);
    });
  }

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }


}
