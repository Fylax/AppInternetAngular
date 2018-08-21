import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Urls, UrlService} from './url.service';
import {catchError, first, switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, private baseService: UrlService) {
  }

  public usernameAvailable(username: string): Observable<boolean> {
    const params = new HttpParams()
        .set('type', 'username')
        .set('value', username);
    return fromPromise(this.baseService.promise)
        .pipe(
            first(),
            switchMap((urls: Urls) => {
              return this.http.get<boolean>(urls.register.href, {
                params: params,
                responseType: 'json'
              });
            })
        );
  }

  public emailAvailable(email: string): Observable<boolean> {
    const params = new HttpParams()
        .set('type', 'email')
        .set('value', email);
    return fromPromise(this.baseService.promise)
        .pipe(
            first(),
            switchMap((urls: Urls) => {
              return this.http.get<boolean>(urls.register.href, {
                params: params,
                responseType: 'json'
              });
            })
        );
  }

  public register(username: string, email: string, password: string) {
    const body = new HttpParams()
        .set('username', username)
        .set('email', email)
        .set('password', password);
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urls: Urls) => {
              return this.http.post<string>(
                  urls.register.href,
                  body, {
                    headers: new HttpHeaders({
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }),
                    responseType: 'json'
                  });
            })
        );
  }

}
