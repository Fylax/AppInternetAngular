import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {first, switchMap} from 'rxjs/operators';
import {from, Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {Urls} from "../model/urls";
import {RestResource} from "../model/rest-resource.enum";
import * as urijs from 'urijs';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private onlyOauth_: boolean;
  private promise_: Promise<Urls>;

  constructor(private http: HttpClient) {
    this.refresh();
  }

  get hasOnlyOauth(): boolean {
    return this.onlyOauth_;
  }

  refresh(): void {
    this.promise_ = new Promise((resolve) => {
      this.http.get(environment.baseUrl)
          .pipe(first())
          .subscribe((json: { _links: Urls }) => {
            this.onlyOauth_ = Object.keys(json._links).length === 2;
            resolve(json._links);
          });
    });
  }

  public get(url: RestResource, headers: HttpHeaders, query: HttpParams,
             authenticated: boolean, urlTemplate?: {}): Observable<any> {
    return from(this.promise_)
        .pipe(
            switchMap((urls: Urls) => {
              let href = urls[url].href;
              if (urlTemplate) {
                href = URITemplate(href).expand(urlTemplate).valueOf();
              }
              return this.http.get(href, {
                headers: headers,
                params: query,
                responseType: 'json',
                withCredentials: authenticated
              });
            })
        );
  }

  public post(url: RestResource, body: string, headers: HttpHeaders, authenticated: boolean): Observable<any> {
    return from(this.promise_)
        .pipe(
            switchMap((urls: Urls) => {
              return this.http.post(
                  urls[url].href,
                  body, {
                    headers: headers,
                    responseType: 'json',
                    withCredentials: authenticated
                  });
            })
        );
  }

  public delete(url: RestResource, authenticated: boolean, urlTemplate?: {}): Observable<any> {
    return from(this.promise_)
        .pipe(
            switchMap((urls: Urls) => {
              let href = urls[url].href;
              if (urlTemplate) {
                href = URITemplate(href).expand(urlTemplate).valueOf();
              }
              return this.http.delete(
                  href,
                  {
                    withCredentials: authenticated
                  }
              );
            })
        );
  }
}

