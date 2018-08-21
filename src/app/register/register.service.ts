import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {UrlService} from '../services/url.service';
import {RestResource} from "../model/rest-resource.enum";

@Injectable()
export class RegisterService {

  constructor(private http: HttpClient, private baseService: UrlService) { }

  public usernameAvailable(username: string): Observable<boolean> {
    const params = new HttpParams()
        .set('type', 'username')
        .set('value', username);
    return this.baseService.get(RestResource.Register, new HttpHeaders(), params, false);
  }

  public emailAvailable(email: string): Observable<boolean> {
    const params = new HttpParams()
        .set('type', 'email')
        .set('value', email);
    return this.baseService.get(RestResource.Register, new HttpHeaders(), params, false);
  }

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

}
