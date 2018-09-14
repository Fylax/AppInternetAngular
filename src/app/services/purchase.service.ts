import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UrlService} from './url.service';
import {RestResource} from "../model/rest-resource.enum";
import {ArchivesPaginationSupport} from '../model/archives-pagination-support';

@Injectable()
export class PurchaseService {

  constructor(private http: HttpClient, private baseService: UrlService) { }

  /**
   * Method for retrieving the purchased archive list per user
   * @param pageIndex: page number
   * @param pageSize: number of archives per page
   * @param userId: optional, used in case of admin request
   */
  getPurchasedArchives(pageIndex = 1, pageSize = 3, userId?: string): Observable<ArchivesPaginationSupport> {
    const params = new HttpParams()
        .set('page', pageIndex.toString())
        .set('limit', pageSize.toString());
    if (userId) {
      const expand = {
        id: userId
      };
      return this.baseService.get(RestResource.AdminUserPurchasedArchives, new HttpHeaders(), params, true, expand);
    }
    return this.baseService.get(RestResource.PurchasedArchives, new HttpHeaders(), params, true);
  }

  /**
   * Method to download a purchased archive
   * @param archiveId: the Id of archive to be downloaded
   * @param userId: optional, used in case of admin request
   */
  downloadPurchasedArchive(archiveId: string, userId?: string): Observable<any> {
    const expand = {
      archiveId: archiveId
    };
    if (userId) {
      expand['id'] = userId;
      return this.baseService.get(RestResource.AdminUserPurchasedArchive, new HttpHeaders(), new HttpParams(), true, expand);
    }
    return this.baseService.get(RestResource.PurchasedArchive, new HttpHeaders(), new HttpParams(), true, expand);
  }

}
