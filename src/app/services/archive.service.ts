import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '../../../node_modules/@angular/common/http';
import {Urls, UrlService} from './url.service';
import {UserSearchRequest} from '../model/UserSearchRequest';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap} from 'rxjs/operators';
import {PurchasesPaginationSupport} from '../model/PurchasesPaginationSupport';
import {Observable} from 'rxjs';
import {ApproximatedArchive} from '../model/ApproximatedArchive';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  constructor(private http: HttpClient, private baseService: UrlService) {
  }

  searchArchives(usr: UserSearchRequest): Observable<ApproximatedArchive[]> {
    return fromPromise(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              const url = URITemplate(urlList.userArchiveSearch.href).expand({
                request:  btoa(JSON.stringify(usr))
              }).valueOf();
              return this.http.get<ApproximatedArchive[]>(url, {
                headers: new HttpHeaders({'Accept': 'application/json'})
              });
            })
        );
  }
}
