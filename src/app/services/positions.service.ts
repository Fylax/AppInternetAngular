import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserSearchRequest} from '../model/user-search-request';
import {UserRequest} from '../model/user-request';
import {UrlService} from "./url.service";
import {RestResource} from "../model/rest-resource.enum";

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  private filePath = 'assets/myPositions.json';

  constructor(private http: HttpClient, private baseService: UrlService) {
  }

  getPositionCount(cr: UserSearchRequest): Observable<number> {
    const params = new HttpParams().set('request', btoa(JSON.stringify(cr)));
    return this.baseService.get(RestResource.Positions, new HttpHeaders(), params, true);
  }

  getPositions(): Observable<string> {
    return this.http.get<string>(this.filePath);
  }

  postPositions(body: string): Observable<Response> {
    return this.baseService.post(RestResource.Positions, body, new HttpHeaders(), true);
  }

  getPositionsFromServer(ur: UserRequest, userId?: string): Observable<any> {
    const expand = {
      start: (ur.start.getTime() * 1000).toString(),
      end: (ur.end.getTime() * 1000).toString()
    };
    if (userId) {
      expand['id'] = userId;
      return this.baseService.get(RestResource.AdminUserPositions, new HttpHeaders(), new HttpParams(), true, expand);
    } else {
      return this.baseService.get(RestResource.Archives, new HttpHeaders(), new HttpParams(), true, expand);
    }
  }
}
