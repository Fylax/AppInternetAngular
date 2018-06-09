import {AfterViewInit, Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {UserTokenService} from "../../services/user.service";
import {LoginService} from "../../services/login.service";
import {SpinnerService} from "../../services/spinner.service";

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
      Validators.required,
      Validators.email
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
              private spinner: SpinnerService) { }

  login() {
    this.spinner.showSpinner();
    this.loginservice.login(this.username.value, this.password.value)
        .subscribe((data) => {
          let x = 0;
        }, (error) => {
          let y = 0;
        });
  }

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }


}
