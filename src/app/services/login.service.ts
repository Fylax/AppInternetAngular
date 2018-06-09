import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = environment.baseUrl + 'oauth/token';

  constructor(private http: HttpClient) {
  }

  public login(username: string, password: string): Observable<{ access_token: string, refresh_token: string }> {
    const body = new HttpParams()
        .set('grant_type', 'password')
        .set('username', username)
        .set('password', password)
        .set('client_id', environment.clientId)
        .set('client_secret', environment.clientSecret);

    return this.http.post<{ access_token: string, refresh_token: string }>(this.url, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }),
      responseType: 'json',
      withCredentials: true
    });
  }
}
