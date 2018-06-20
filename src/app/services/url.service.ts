import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {first} from 'rxjs/operators';

interface Url {
  href: string;
}

export interface Urls {
    oauth?: Url;
    userPositions?: Url;
    customerPositions?: Url;
    customerPurchases?: Url;
    customerPurchaseDetails?: Url;
    adminUsers?: Url;
    adminCustomers?: Url;
    adminCustomerPurchases?: Url;
    adminCustomerPurchase?: Url;
    adminUserPositions?: Url;
}

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private links: Urls = {};
  promise;

  constructor(private http: HttpClient) {
    this.promise = new Promise((resolve, reject) => {
      this.http.get(environment.baseUrl)
          .pipe(first())
          .subscribe((json: {_links: Urls}) => {
            this.links = json._links;
            resolve(this.links);
          });
    });
  }
}

