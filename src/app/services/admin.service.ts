import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Urls, UrlService} from './url.service';
import {switchMap} from 'rxjs/operators';
import {PurchasesPaginationSupport} from '../model/PurchasesPaginationSupport';
import {from, Observable} from 'rxjs';
import {AdminPaginatorSupport} from '../model/AdminPaginatorSupport';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private urlService: UrlService) { }

  getUsers(pageIndex = 1, pageSize = 3): Observable<AdminPaginatorSupport> {
    return from(this.urlService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.get<AdminPaginatorSupport>(urlList.adminUsers.href, {
                params: new HttpParams()
                    .set('page', pageIndex.toString())
                    .set('limit', pageSize.toString())});
            })
        );
  }

  getCustomers(pageIndex = 1, pageSize = 3): Observable<AdminPaginatorSupport> {
    return from(this.urlService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.get<AdminPaginatorSupport>(urlList.adminCustomers.href, {
                params: new HttpParams()
                    .set('page', pageIndex.toString())
                    .set('limit', pageSize.toString())});
            })
        );
  }
}
