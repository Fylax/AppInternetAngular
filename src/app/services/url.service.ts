import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {first} from 'rxjs/operators';
import {fromPromise} from "rxjs/internal-compatibility";

interface Url {
  href: string;
}

export interface Urls {
  oauth?: Url;
  register?: Url;
  userArchives?: Url;
  userArchive?: Url;
  userArchiveSearch?: Url;
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

  private onlyOauth_: boolean;
  private promise_: Promise<Urls>;

  constructor(private http: HttpClient) {
    this.refresh();
  }

  get hasOnlyOauth(): boolean {
    return this.onlyOauth_;
  }

  get promise(): Promise<Urls> {
    return this.promise_;
  }

  refresh(): void {
    this.promise_ = new Promise((resolve) => {
      this.http.get(environment.baseUrl)
          .pipe(first())
          .subscribe((json: { _links: Urls }) => {
            this.onlyOauth_ = Object.keys(json._links).length === 2;
            resolve(json._links);
          });
    });
  }
}

