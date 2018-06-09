import {AfterViewInit, Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {UserTokenService} from "../../services/user.service";
import {LoginService} from "../../services/login.service";
import {SpinnerService} from "../../services/spinner.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

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
              private router: Router) { }

  login() {
    this.spinner.showSpinner();
    this.loginservice.login(this.username.value, this.password.value)
        .subscribe((data) => {
          this.user.setTokens(data.access_token, data.refresh_token);
          // TODO switch sui ruoli
          this.router.navigate(['positions']);
        }, (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.valid = false;
            this.spinner.hideSpinner();
          }
        });
  }

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }


}
