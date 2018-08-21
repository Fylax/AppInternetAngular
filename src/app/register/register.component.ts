import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";

import * as zxcvbn from "zxcvbn";
import * as XRegExp from "xregexp";
import {RegisterService} from "./register.service";
import {Observable, throwError} from "rxjs";
import {catchError, first, map, switchMap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements AfterViewInit, OnInit {

  error = false;
  progressPerc = 0;
  progressCol = 'warn';
  form: FormGroup;
  private lower = XRegExp('\\p{Ll}');
  private upper = XRegExp('\\p{Lu}');
  private digit = XRegExp('\\p{N}');
  private symbol = XRegExp('\\p{S}|\\p{P}|\\p{Zs}');
  private email = new RegExp('/^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/');

  constructor(private registerService: RegisterService,
              private router: Router) {
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
          Validators.email,
          Validators.pattern(this.email)
        ],
        asyncValidators: [
          this.emailValidator()
        ]
      }),
    });
    this.form.addControl('password', new FormControl('', {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.minLength(8),
            this.symbols()
          ]
        })
    );
    this.form.addControl('confirm', new FormControl('', {
          updateOn: 'change',
          validators: [
            Validators.required,
            this.matching()
          ]
        })
    );
  }

  userValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<{ [key: string]: any } | null> => {
      return this.registerService.usernameAvailable(control.value)
          .pipe(
              map(usable => {
                    return (usable) ? null : {'exists': true};
                  }
              )
          );
    };
  }

  emailValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<{ [key: string]: any } | null> => {
      return this.registerService.emailAvailable(control.value)
          .pipe(
              map(usable => {
                    return (usable) ? null : {'exists': true};
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

  register() {
    this.registerService.register(this.form.get('username').value,
        this.form.get('email').value, this.form.get('password').value)
        .pipe(
            first(),
            catchError((error: HttpErrorResponse) => {
              this.error = true;
              return throwError(error.message);
            })
        )
        .subscribe(() => {
          this.router.navigate(['login']);
        });
  }

  ngAfterViewInit() {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }

}
