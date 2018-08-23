import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {Purchase} from '../../model/purchase';
import {UrlService} from '../../services/url.service';
import {switchMap} from 'rxjs/operators';
import {UserSearchRequest} from '../../model/user-search-request';
import {PurchasesPaginationSupport} from '../../model/purchases-pagination-support';
import {RestResource} from "../../model/rest-resource.enum";

@Injectable()
export class PurchaseService {

  constructor(private http: HttpClient, private baseService: UrlService) { }

  buyPositions(cr: UserSearchRequest): Observable<{}> {
    return this.baseService.post(RestResource.Positions, cr.toJSON().toString(), new HttpHeaders(), true);
  }

  getPurchaseList(pageIndex = 1, pageSize = 3, customerId?: string): Observable<PurchasesPaginationSupport> {
    const params = new HttpParams()
        .set('page', pageIndex.toString())
        .set('limit', pageSize.toString())
    if (customerId) {
      const expand = {
        id: customerId
      };
      return this.baseService.get(RestResource.AdminCustomerPurchases, new HttpHeaders(), params, true, expand);
    }
    return this.baseService.get(RestResource.Purchases, new HttpHeaders(), params, true);
  }

  getPurchaseDetails(purchaseId: string, customerId?: string): Observable<Purchase> {
    const expand = {
      purchase: purchaseId
    };
    if (customerId) {
      expand['id'] = customerId;
      return this.baseService.get(RestResource.PurchaseDetails, new HttpHeaders(), new HttpParams(), true, expand);
    }
    return this.baseService.get(RestResource.AdminCustomerPurchase, new HttpHeaders(), new HttpParams(), true, expand);
  }

}
