import {AfterViewInit, Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

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
    updateOn: 'blur',
    validators: [
      Validators.required
    ]
  });

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }


}
