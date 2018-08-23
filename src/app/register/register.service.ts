import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";
import {UrlService} from '../services/url.service';
import {RestResource} from "../model/rest-resource.enum";
import * as XRegExp from "xregexp";

@Injectable()
export class RegisterService {

  /**
   * Regex matching all UNICODE lowercase letters.
   */
  private lower = XRegExp('\\p{Ll}');
  /**
   * Regex matching all UNICODE uppercase letters.
   */
  private upper = XRegExp('\\p{Lu}');
  /**
   * Regex matching all UNICODE digits.
   */
  private digit = XRegExp('\\p{N}');
  /**
   * Regex matching all UNICODE symbols.
   */
  private symbol = XRegExp('\\p{S}|\\p{P}|\\p{Zs}');
  /**
   * Regex matching 99% of valid emails (may give false positive); used in conjunction of
   * HTML email input type to provide stronger validation.
   *
   * This is the same regular expression used on server, to avoid useless REST requests.
   */
  private email = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|' +
      '(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');

  /**
   * See getter.
   */
  private form_ = new FormGroup({
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

  constructor(private http: HttpClient, private baseService: UrlService) {
    this.form_.addControl('password', new FormControl('', {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.minLength(8),
            this.minimumSymbols()
          ]
        })
    );
    this.form_.addControl('confirm', new FormControl('', {
          updateOn: 'change',
          validators: [
            Validators.required,
            this.matchingPasswords()
          ]
        })
    );
  }

  /**
   * Persistent form containing registration inputs status and validators.
   */
  public get form(): FormGroup {
    return this.form_;
  }

  /**
   * Method for trying user registration.
   * @param username Username.
   * @param email Email.
   * @param password Clear-text user password.
   */
  public register(username: string, email: string, password: string) {
    const body = new HttpParams()
        .set('username', username)
        .set('email', email)
        .set('password', password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.baseService.post(RestResource.Register, body.toString(), headers, false);
  }

  /**
   * Performs a REST request to check if a username is available.
   * @returns Async User Validator
   */
  private userValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<{ [key: string]: any } | null> => {
      const params = new HttpParams()
          .set('type', 'username')
          .set('value', control.value);
      return this.baseService.get(RestResource.Register, new HttpHeaders(), params, false)
          .pipe(
              first(),
              map(usable => {
                    return (usable) ? null : {'exists': true};
                  }
              )
          );
    };
  }

  /**
   * Performs a REST request to check if an email is available.
   * @returns Async Email Validator
   */
  private emailValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<{ [key: string]: any } | null> => {
      const params = new HttpParams()
          .set('type', 'email')
          .set('value', control.value);
      return this.baseService.get(RestResource.Register, new HttpHeaders(), params, false)
          .pipe(
              first(),
              map(usable => {
                    return (usable) ? null : {'exists': true};
                  }
              )
          );
    };
  }

  /**
   * Checks if password and password confirmation fields contain the same value.
   * @returns Matching Password Validator
   */
  private matchingPasswords(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const match = control.value === this.form_.get('password').value;
      return match ? null : {'matching': {value: control.value}};
    };
  }

  /**
   * Checks if password field contain at least three characters between UNICODE lowercase letters,
   * uppercase letters, digits and symbols.
   * @returns Minimum Symbols Password Validator
   */
  private minimumSymbols(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const match = Number(XRegExp.test(control.value, this.lower)) +
          Number(XRegExp.test(control.value, this.upper)) +
          Number(XRegExp.test(control.value, this.digit)) +
          Number(XRegExp.test(control.value, this.symbol));
      return match >= 3 ? null : {'symbols': {value: control.value}};
    };
  }

}
