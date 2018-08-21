import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Purchase} from '../model/Purchase';
import {Urls, UrlService} from './url.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap} from 'rxjs/operators';
import {UserSearchRequest} from '../model/UserSearchRequest';
import {PurchasesPaginationSupport} from '../model/PurchasesPaginationSupport';
import * as urijs from 'urijs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient, private baseService: UrlService) { }

  buyPositions(cr: UserSearchRequest): Observable<{}> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.post(urlList.customerPositions.href, cr.toJSON());
            })
        );
  }

  getPurchaseList(pageIndex = 1, pageSize = 3, customerId?: string): Observable<PurchasesPaginationSupport> {
    return fromPromise(this.baseService.promise)
         .pipe(
             switchMap((urlList: Urls) => {
               let url: string;
               if (customerId === undefined) {
                 url = URITemplate(urlList.customerPurchases.href).expand({}).valueOf();
               } else {
                 url = URITemplate(urlList.adminCustomerPurchases.href).expand( {
                   id: customerId
                 }).valueOf();
               }
                return this.http.get<PurchasesPaginationSupport>(url, {
                  params: new HttpParams()
                      .set('page', pageIndex.toString())
                      .set('limit', pageSize.toString())});
                })
         );
  }

  getPurchaseDetails(purchaseId: string, customerId?: string): Observable<Purchase> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              let url: string;
              if (customerId === undefined) {
                url = URITemplate(urlList.customerPurchaseDetails.href).expand( {}).valueOf();
              } else {
                url = URITemplate(urlList.adminCustomerPurchase.href).expand( {
                  id: customerId
                }).valueOf();
              }
              return this.http.get<Purchase>(`${url}${purchaseId}`);
            })
        );
  }

}
