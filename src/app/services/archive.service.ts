import {Injectable} from '@angular/core';
import {ArchivesPaginationSupport} from "../model/archives-pagination-support";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UrlService} from './url.service';
import {UserSearchRequest} from '../model/user-search-request';
import {Observable} from 'rxjs';
import {ApproximatedArchive} from '../model/approximated-archive';
import {RestResource} from "../model/rest-resource.enum";

@Injectable()
export class ArchiveService {

  constructor(private http: HttpClient, private baseService: UrlService) {
  }

  searchArchives(usr: UserSearchRequest): Observable<ApproximatedArchive[]> {
    const headers = new HttpHeaders({'Accept': 'application/json'});
    const expand = {request: btoa(JSON.stringify(usr))};
    return this.baseService.get(RestResource.ArchiveSearch, headers, new HttpParams(),
        true, expand);
  }

  getArchiveList(pageIndex = 1, pageSize = 3, userId?: string): Observable<ArchivesPaginationSupport> {
    const params = new HttpParams()
        .set('page', pageIndex.toString())
        .set('limit', pageSize.toString());
    if (userId) {
      const expand = {id : userId};
      return this.baseService.get(RestResource.AdminCustomerPurchases, new HttpHeaders(), params, true, expand);
    }
    return this.baseService.get(RestResource.Archives, new HttpHeaders(), params, true);
  }

  deleteArchive(archiveId: string): Observable<{}> {
    const expand = {id: archiveId};
    return this.baseService.delete(RestResource.Archive, true, expand);
  }

  downloadArchive(archiveId: string): Observable<{}> {
    const expand = {id: archiveId};
    return this.baseService.get(RestResource.Archive, new HttpHeaders(), new HttpParams(), true, expand);
  }
}
