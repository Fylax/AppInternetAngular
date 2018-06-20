import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, pipe} from 'rxjs';
import {CustomerRequest} from '../model/CustomerRequest';
import {environment} from '../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {Position} from '../model/Position';
import * as L from 'leaflet';
import {UserRequest} from '../model/UserRequest';
import {fromPromise} from "rxjs/internal-compatibility";
import {Urls, UrlService} from "./url.service";
import {from} from "rxjs/internal/observable/from";

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  private filePath = 'assets/myPositions.json';

  constructor(private http: HttpClient, private baseService: UrlService) {
  }

  getPositionCount(cr: CustomerRequest): Observable<number> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.get<number>(urlList.customerPositions.href, {
                headers: new HttpHeaders({'Accept': 'application/json'}),
                params: new HttpParams().set('request', btoa(JSON.stringify(cr)))
              });
            })
        );
  }

  getPositions(): Observable<string> {
    return this.http.get<string>(this.filePath);
  }

  postPositions(body: string): Observable<Response> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.post<Response>(urlList.userPositions.href, body);
            })
        );
  }

  getPositionsFromServer(ur: UserRequest): Observable<any> {
    const params = new HttpParams()
        .set('start', (ur.start.getTime() * 1000).toString())
        .set('end', (ur.end.getTime() * 1000).toString());
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.get<any>(urlList.userPositions.href, {
                headers: new HttpHeaders({'Accept': 'application/json'}),
                params: params
              });
            })
        );
  }
}
