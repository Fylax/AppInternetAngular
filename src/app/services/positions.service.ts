import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, pipe} from 'rxjs';
import {CustomerRequest} from '../components/logged/map/customer/CustomerRequest';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Position} from '../model/Position';
import * as L from 'leaflet';

@Injectable({
    providedIn: 'root'
})
export class PositionsService {

    private positionsUrl = `${environment.baseUrl}positions/customer`;  // URL to web api
    private filePath = `${environment.baseIcons}myPositions.json`;

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

    getJSON(): Observable<any> {
        return this.http.get(this.filePath);
    }
}
