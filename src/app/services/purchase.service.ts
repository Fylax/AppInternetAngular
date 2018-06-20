import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Purchase} from '../model/Purchase';
import {Urls, UrlService} from './url.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap} from 'rxjs/operators';
import {CustomerRequest} from '../components/logged/map/customer/CustomerRequest';
import {PurchasesPaginationSupport} from '../model/PurchasesPaginationSupport';
import * as urijs from 'urijs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient, private baseService: UrlService) { }

  buyPositions(cr: CustomerRequest): Observable<{}> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.post(urlList.customerPurchases.href, cr.toJSON());
            })
        );
  }

  getPurchaseList(pageIndex = 1, pageSize = 3, customerId?: string): Observable<PurchasesPaginationSupport> {
    return fromPromise(this.baseService.promise)
         .pipe(
             switchMap((urlList: Urls) => {
               let url: string;
               if (customerId === null) {
                 url = urlList.customerPurchases.href;
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

  getPurchaseDetails(purchaseId: string): Observable<Purchase> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.get<Purchase>(`${urlList.customerPurchaseDetails.href}${purchaseId}`);
            })
        );
  }

}
