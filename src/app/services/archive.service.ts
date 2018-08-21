import { Injectable } from '@angular/core';
import {Archive} from '../model/Archive';
import {ArchivesPaginationSupport} from "../model/ArchivesPaginationSupport";
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


  getArchiveList(pageIndex = 1, pageSize = 3, userId?: string): Observable<ArchivesPaginationSupport> {
        return fromPromise(this.baseService.promise)
            .pipe(
                switchMap((urlList: Urls) => {
                    let url: string;
                    if (userId === undefined) {
                        url = URITemplate(urlList.userArchives.href).expand({}).valueOf();
                    } else {
                        url = URITemplate(urlList.adminCustomerPurchases.href).expand({
                            id: userId
                        }).valueOf();
                    }
                    return this.http.get<ArchivesPaginationSupport>(url, {
                        params: new HttpParams()
                            .set('page', pageIndex.toString())
                            .set('limit', pageSize.toString())
                    });
                })
            );
  }

    deleteArchive(archiveId: string): Observable<{}> {
        return fromPromise(this.baseService.promise)
            .pipe(
                switchMap((urlList: Urls) => {
                    let url: string;
                    url = URITemplate(urlList.userArchive.href).expand({}).valueOf();
                    return this.http.delete(`${url}${archiveId}`);
                })
            );
    }

    downloadArchive(archiveId: string): Observable<{}> {
        return fromPromise(this.baseService.promise)
            .pipe(
                switchMap((urlList: Urls) => {
                    let url: string;
                    url = URITemplate(urlList.userArchive.href).expand({}).valueOf();
                    return this.http.get<any>(`${url}${archiveId}`);
                })
            );
    }
}
