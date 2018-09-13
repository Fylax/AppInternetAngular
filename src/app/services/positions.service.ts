import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserRequest} from '../model/user-request';
import {UrlService} from "./url.service";
import {RestResource} from "../model/rest-resource.enum";

@Injectable()
export class PositionsService {

  constructor(private http: HttpClient, private baseService: UrlService) {
  }

  getPositionsFromServer(ur: UserRequest, userId?: string): Observable<any> {
    const expand = {
      start: (ur.start.getTime() * 1000).toString(),
      end: (ur.end.getTime() * 1000).toString()
    };
    if (userId) {
      expand['id'] = userId;
      return this.baseService.get(RestResource.AdminUserArchive, new HttpHeaders(), new HttpParams(), true, expand);
    } else {
      return this.baseService.get(RestResource.Archives, new HttpHeaders(), new HttpParams(), true, expand);
    }
  }
}
