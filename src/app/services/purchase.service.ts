import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Purchase} from '../model/Purchase';
import {UrlService} from './url.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient, private baseService: UrlService) { }

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
