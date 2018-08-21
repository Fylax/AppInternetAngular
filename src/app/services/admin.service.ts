import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UrlService} from './url.service';
import {Observable} from 'rxjs';
import {AdminPaginatorSupport} from '../model/admin-paginator-support';
import {RestResource} from "../model/rest-resource.enum";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private urlService: UrlService) {
  }

  getUsers(pageIndex = 1, pageSize = 3): Observable<AdminPaginatorSupport> {
    const params = new HttpParams()
        .set('page', pageIndex.toString())
        .set('limit', pageSize.toString());
    return this.urlService.get(RestResource.AdminUsers, new HttpHeaders(), params, true);
  }

  getCustomers(pageIndex = 1, pageSize = 3): Observable<AdminPaginatorSupport> {
    const params = new HttpParams()
        .set('page', pageIndex.toString())
        .set('limit', pageSize.toString());
    return this.urlService.get(RestResource.AdminCustomers, new HttpHeaders(), params, true);
  }
}
