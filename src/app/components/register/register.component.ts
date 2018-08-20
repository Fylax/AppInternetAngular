import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";

import * as zxcvbn from "zxcvbn";
import * as XRegExp from "xregexp";
import {RegisterService} from "../../services/register.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements AfterViewInit, OnInit {

  progressPerc = 0;
  progressCol = 'warn';
  form: FormGroup;
  private lower = XRegExp('\\p{Ll}');
  private upper = XRegExp('\\p{Lu}');
  private digit = XRegExp('\\p{N}');
  private symbol = XRegExp('\\p{S}|\\p{P}|\\p{Zs}');

  constructor(private registerService: RegisterService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required
        ],
        asyncValidators: [
            this.userValidator()
        ]
      }),
      email: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.email
        ],
        asyncValidators: [
            this.emailValidator()
        ]
      }),
      password: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.minLength(8),
          this.symbols()
        ]
      }),
      confirm: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          this.matching()
        ]
      })
    });
  }

  userValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<{ [key: string]: any } | null> => {
      return this.registerService.usernameAvailable(control.value)
          .pipe(
              map(res => {
                    return (res) ? {'exists': true} : null;
                  }
              )
          );
    };
  }

  emailValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<{ [key: string]: any } | null> => {
      return this.registerService.emailAvailable(control.value)
          .pipe(
              map(res => {
                    return (res) ? {'exists': true} : null;
                  }
              )
          );
    };
  }

  symbols(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const match = Number(XRegExp.test(control.value, this.lower)) +
          Number(XRegExp.test(control.value, this.upper)) +
          Number(XRegExp.test(control.value, this.digit)) +
          Number(XRegExp.test(control.value, this.symbol));
      return match >= 3 ? null : {'symbols': {value: control.value}};
    };
  }

  strength(event: KeyboardEvent) {
    const strength = zxcvbn((event.currentTarget as HTMLInputElement).value);

    const score = strength.guesses_log10;
    this.progressPerc = Math.round(25 * score / 3); // 12 is max
    if (this.progressPerc < 40) {
      this.progressCol = 'warn';
    } else if (this.progressPerc < 80) {
      this.progressCol = 'accent';
    } else {
      this.progressCol = 'primary';
    }
  }

  updateConfirmation() {
    if (this.form.get('password').valid) {
      const confirm = this.form.get('confirm');
      if (!confirm.hasError('required')) {
        confirm.updateValueAndValidity({onlySelf: true});
      }
    }
  }

  matching(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const match = control.value === this.form.get('password').value;
      return match ? null : {'matching': {value: control.value}};
    };
  }

  ngAfterViewInit() {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }

}
