import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UrlService} from './url.service';
import {switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {PurchasesPaginationSupport} from '../model/PurchasesPaginationSupport';
import {Observable} from 'rxjs';
import {AdminPaginatorSupport} from '../model/AdminPaginatorSupport';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private urlService: UrlService) { }

  getUsers(pageIndex = 1, pageSize = 3): Observable<AdminPaginatorSupport> {
    return fromPromise(this.urlService.promise)
        .pipe(
            switchMap(urlList => {
              return this.http.get<AdminPaginatorSupport>(urlList['users'], {
                params: new HttpParams()
                    .set('page', pageIndex.toString())
                    .set('limit', pageSize.toString())});
            })
        );
  }

  getCustomers(pageIndex = 1, pageSize = 3): Observable<AdminPaginatorSupport> {
    return fromPromise(this.urlService.promise)
        .pipe(
            switchMap(urlList => {
              return this.http.get<AdminPaginatorSupport>(urlList['customers'], {
                params: new HttpParams()
                    .set('page', pageIndex.toString())
                    .set('limit', pageSize.toString())});
            })
        );
  }
}
