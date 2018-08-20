import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {first} from 'rxjs/operators';

interface Url {
  href: string;
}

export interface Urls {
  oauth?: Url;
  register?: Url;
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
  private promise_: Promise<Urls>;

  constructor(private http: HttpClient) {
    this.refresh();
  }

  get hasOnlyOauth(): boolean {
    return Object.keys(this.links).length === 2;
  }

  get promise(): Promise<Urls> {
    return this.promise_;
  }

  refresh(): void {
    this.promise_ = new Promise((resolve) => {
      this.http.get(environment.baseUrl)
          .pipe(first())
          .subscribe((json: { _links: Urls }) => {
            this.links = json._links;
            resolve(this.links);
          });
    });
  }
}

