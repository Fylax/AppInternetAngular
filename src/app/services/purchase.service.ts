import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Purchase} from '../model/Purchase';
import {UrlService} from './url.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, switchMap} from 'rxjs/operators';
import {CustomerRequest} from '../components/logged/map/customer/CustomerRequest';

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

  getPurchaseList(): Observable<Purchase[]> {
     return fromPromise(this.baseService.promise)
         .pipe(
             switchMap(urlList => {
                return this.http.get<Purchase[]>(urlList['purchases']);
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
