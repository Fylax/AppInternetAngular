import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, first, switchMap} from 'rxjs/operators';
import {from, Observable, Subject} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {Urls} from '../model/urls';
import {RestResource} from '../model/rest-resource.enum';
import * as urijs from 'urijs';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  /**
   * See getter.
   */
  private onlyOauth_: boolean;
  /**
   * Promise containing all REST endpoints fetched from server.
   */
  private promise_: Promise<Urls>;

  constructor(private http: HttpClient) {
    this.refresh();
  }

  /**
   * Whether only OAuth links are provided (meeaning only login and registration links).
   */
  get hasOnlyOauth(): boolean {
    return this.onlyOauth_;
  }

  /**
   * Refetches REST endpoint links from server.
   *
   * This may be due to login.
   */
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

  /**
   * Generic method for performing an HTTP GET.
   * @param url REST Resource URL mapped name.
   * @param headers Headers for this request.
   * @param query Query Params for this request.
   * @param authenticated Whether the request has credentials.
   * @param urlTemplate Optional list of URL template resolvers.
   */
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

  /**
   * Generic method for performing an HTTP POST.
   * @param url REST Resource URL mapped name.
   * @param body Body for this request.
   * @param headers Headers for this request.
   * @param authenticated Whether the request has credentials.
   */
  public post(url: RestResource, body: any, headers: HttpHeaders, authenticated: boolean): Observable<any> {
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
  /**
   * Generic method for performing an HTTP POST and reporting progress.
   * @param url REST Resource URL mapped name.
   * @param body Body for this request.
   * @param headers Headers for this request.
   * @param authenticated Whether the request has credentials.
   */
  public postProgress(url: RestResource, body: any, headers: HttpHeaders, authenticated: boolean): Observable<any> {
    return from(this.promise_)
        .pipe(
            switchMap((urls: Urls) => {
              const req = new HttpRequest('POST', urls[url].href, body, {
                reportProgress: true
              });
              return this.http.request(req);
            })
        );
  }

  /**
   * Generic method for performing an HTTP DELETE.
   * @param url REST Resource URL mapped name.
   * @param authenticated Whether the request has credentials.
   * @param urlTemplate Optional list of URL template resolvers.
   */
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
                    withCredentials: authenticated,
                    observe: 'response'
                  }
              );
            })
        );
  }
}

