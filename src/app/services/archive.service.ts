import {Injectable} from '@angular/core';
import {ArchivesPaginationSupport} from '../model/archives-pagination-support';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UrlService} from './url.service';
import {UserSearchRequest} from '../model/user-search-request';
import {Observable} from 'rxjs';
import {ApproximatedArchive} from '../model/approximated-archive';
import {RestResource} from '../model/rest-resource.enum';

@Injectable()
export class ArchiveService {
  readonly userSearchRequest_: UserSearchRequest;
  private _approximatedArchiveSelectedList: ApproximatedArchive[];

  constructor(private http: HttpClient, private baseService: UrlService) {
    this._approximatedArchiveSelectedList = [];
    this.userSearchRequest_ = new UserSearchRequest();
  }

  get userSearchRequest() {
    return this.userSearchRequest_;
  }

  get approximatedArchiveSelectedList(): ApproximatedArchive[] {
    return this._approximatedArchiveSelectedList;
  }

  set approximatedArchiveSelectedList(value: ApproximatedArchive[]) {
    this._approximatedArchiveSelectedList = value;
  }

  /**
   * Method for retrieving all the approximated archives satisfying the constraints (polygon, dates)
   * @param usr: UserSearchRequest object containing polygon area and time interval
   */
  searchArchives(usr: UserSearchRequest): Observable<ApproximatedArchive[]> {
    const headers = new HttpHeaders({'Accept': 'application/json'});
    const expand = {request: btoa(JSON.stringify(usr))};
    return this.baseService.get(RestResource.ArchiveSearch, headers, new HttpParams(),
        true, expand);
  }

  /**
   * Method for retrieving the list of personal archives per user
   * @param pageIndex: page number
   * @param pageSize: number of archives per page
   * @param userId: optional, used in case of admin request
   */
  getArchiveList(pageIndex = 1, pageSize = 3, userId?: string): Observable<ArchivesPaginationSupport> {
    const params = new HttpParams()
        .set('page', pageIndex.toString())
        .set('limit', pageSize.toString());
    if (userId) {
      const expand = {id: userId};
      return this.baseService.get(RestResource.AdminUserPurchasedArchives, new HttpHeaders(), params, true, expand);
    }
    return this.baseService.get(RestResource.Archives, new HttpHeaders(), params, true);
  }

  /**
   * Method to delete one archive
   * @param archiveId: the Id of archive to be removed
   */
  deleteArchive(archiveId: string): Observable<any> {
    const expand = {archiveId: archiveId};
    return this.baseService.delete(RestResource.Archive, true, expand);
  }

  /**
   * Method to download one archive
   * @param archiveId: the Id of archive to be downloaded
   */
  downloadArchive(archiveId: string): Observable<any> {
    const expand = {archiveId: archiveId};
    return this.baseService.get(RestResource.Archive, new HttpHeaders(), new HttpParams(), true, expand);
  }

  /**
   * Method to upload one archive
   * @param file: the archive to be uploaded
   */
  upload(file: File): Observable<any> {
    return this.baseService.post(RestResource.Archives, file, new HttpHeaders(), true);
  }

  /**
   * Send the list of archive to book
   * @param currArchiveList: list of approximated archive selected
   */
  confirmPurchaseArchives(currArchiveList: ApproximatedArchive[]): Observable<Response> {
    const body = JSON.stringify(currArchiveList);
    return this.baseService.post(RestResource.PurchasedArchives, body.toString(), new HttpHeaders(), true);
  }
}
