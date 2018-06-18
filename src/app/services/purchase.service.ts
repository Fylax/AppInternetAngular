import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Purchase} from '../model/Purchase';
import {UrlService} from './url.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap} from 'rxjs/operators';
import {CustomerRequest} from '../components/logged/map/customer/CustomerRequest';
import {PurchasesPaginationSupport} from '../model/PurchasesPaginationSupport';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient, private baseService: UrlService) { }

  buyPositions(cr: CustomerRequest): Observable<{}> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap(urlList => {
              return this.http.post(urlList['customerPositions'], cr.toJSON());
            })
        );
  }

  getPurchaseList(pageIndex = 1, pageSize = 3): Observable<PurchasesPaginationSupport> {
     return fromPromise(this.baseService.promise)
         .pipe(
             switchMap(urlList => {
                return this.http.get<PurchasesPaginationSupport>(urlList['purchases'], {
                  params: new HttpParams()
                      .set('page', pageIndex.toString())
                      .set('limit', pageSize.toString())});
                })
         );
  }

  getPurchaseDetails(purchaseId: string): Observable<Purchase> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap(urlList => {
              const url = `${urlList['purchaseDetails']}${purchaseId}`;
              return this.http.get<Purchase>(url);
            })
        );
  }

}
