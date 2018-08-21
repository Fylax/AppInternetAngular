import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {Urls, UrlService} from '../services/url.service';
import {first, switchMap} from 'rxjs/operators';

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
    return from(this.baseService.promise)
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
    return from(this.baseService.promise)
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
    return from(this.baseService.promise)
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
