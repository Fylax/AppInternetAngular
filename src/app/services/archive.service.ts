import {Injectable} from '@angular/core';
import {ArchivesPaginationSupport} from '../model/archives-pagination-support';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {UrlService} from './url.service';
import {UserSearchRequest} from '../model/user-search-request';
import {Observable, of, Subject} from 'rxjs';
import {ApproximatedArchive} from '../model/approximated-archive';
import {RestResource} from '../model/rest-resource.enum';
import {catchError, finalize} from 'rxjs/operators';

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
      const expand = {id: userId};
      return this.baseService.get(RestResource.AdminUserPurchasedArchives, new HttpHeaders(), params, true, expand);
    }
    return this.baseService.get(RestResource.Archives, new HttpHeaders(), params, true);
  }

  deleteArchive(archiveId: string): Observable<any> {
    const expand = {archiveId: archiveId};
    return this.baseService.delete(RestResource.Archive, true, expand);
  }

  downloadArchive(archiveId: string): Observable<any> {
    const expand = {archiveId: archiveId};
    return this.baseService.get(RestResource.Archive, new HttpHeaders(), new HttpParams(), true, expand);
  }

  upload(file: File): Observable<number> {
    const progress = new Subject<number>();
    this.baseService.postProgress(RestResource.Archives, file, new HttpHeaders(), true)
        .pipe(
            catchError(() => {
              console.log('badRequest');
              return of();
            }),
            finalize(() => progress.complete())
        ).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        // calculate the progress percentage
        const percentDone = Math.round(100 * event.loaded / event.total);

        // pass the percentage into the progress-stream
        progress.next(percentDone);
      } else if (event instanceof HttpResponse) {

        // Close the progress-stream if we get an answer form the API
        // The upload is complete
        progress.complete();
      }
    });
    return progress.asObservable();
  }
}
