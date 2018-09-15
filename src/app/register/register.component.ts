import {AfterViewInit, Component} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {RegisterService} from "./register.service";
import {throwError} from "rxjs";
import {catchError, first, retry} from "rxjs/operators";
import * as zxcvbn from "zxcvbn";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements AfterViewInit {

  /**
   * Generic error after REST request.
   */
  error = false;
  /**
   * Strength progress bar percentage.
   */
  progressPerc = 0;
  /**
   * Strength prorgress bar color:
   * * `warn`: [0-40)%
   * * `accent`: [40-80)%
   * * `primary`: [80-100]%
   */
  progressCol = 'warn';

  constructor(public service: RegisterService,
              private router: Router) {
  }

  /**
   * Evaluates password strength by means of zxcvbn library and updates
   * the password strength progress bar accordingly.
   *
   * As unit of measure order of magnitude of guesses required for matching
   * the password (Log<sub>10</sub>(guesses)) has been uses, choosing
   * 12 as 100% and scaling values accordingly.
   * @param event Keyboard `keyup` event.
   */
  strength(event: KeyboardEvent) {
    const strength = zxcvbn((event.currentTarget as HTMLInputElement).value);

    const score = strength.guesses_log10;
    this.progressPerc = Math.round(25 * score / 3); // 12 is max
    if (this.progressPerc > 100) {
      this.progressPerc = 100;
    }
    if (this.progressPerc < 40) {
      this.progressCol = 'warn';
    } else if (this.progressPerc < 80) {
      this.progressCol = 'accent';
    } else {
      this.progressCol = 'primary';
    }
  }

  /**
   * Once the password field emits the `blur` event, it calls this method that is
   * charge of updating password confirm field validity (meaning that it checks if
   * it non empty, and in the affermative case checks if both fields contains
   * the same value).
   */
  updateConfirmation() {
    if (this.service.form.get('password').valid) {
      const confirm = this.service.form.get('confirm');
      if (!confirm.hasError('required')) {
        confirm.updateValueAndValidity({onlySelf: true});
      }
    }
  }

  /**
   * Tries registration. In case of success it redirects to login homepage, otherwise it shows an error message.
   */
  register() {
    this.service.register(this.service.form.get('username').value,
        this.service.form.get('email').value, this.service.form.get('password').value)
        .pipe(
            first(),
            retry(3),
            catchError((error: HttpErrorResponse) => {
              this.error = true;
              return throwError(error.message);
            })
        )
        .subscribe(() => {
          this.router.navigateByUrl('login');
        });
  }

  ngAfterViewInit() {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }

}
