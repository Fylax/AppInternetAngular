import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomerRequest} from "../components/logged/map/customer/CustomerRequest";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  private positionsUrl = `${environment.baseUrl}positions/customer`;  // URL to web api

  constructor(private http: HttpClient) {
  }

  /**
   getPositions(timestamp: Date): Observable<Position[]> {
        const currentUrl = `${this.positionsUrl}/${timestamp}`;
        return this.http.get<Position[]>(currentUrl);
        //.pipe(catchError(this.handleError('getPositions', [])))           //after add polygon and to implement handleError<T> ?!?!
    }
   **/

  getPositionCount(cr: CustomerRequest): Observable<number> {
    return this.http.get<number>(this.positionsUrl, {
      headers: new HttpHeaders({'Accept': 'application/json'}),
      params: new HttpParams().set('request', btoa(JSON.stringify(cr)))
    });
  }
}
