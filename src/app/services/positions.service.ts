import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, pipe} from 'rxjs';
import {CustomerRequest} from '../components/logged/map/customer/CustomerRequest';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Position} from '../model/Position';
import * as L from 'leaflet';
import {UserRequest} from '../components/logged/map/user/UserRequest';

@Injectable({
    providedIn: 'root'
})
export class PositionsService {

    private positionsCustomerUrl = `${environment.baseUrl}positions/customer`;  // URL to web api
    private positionsUserUrl = `${environment.baseUrl}positions/user`;
    private filePath = 'assets/myPositions.json';

    constructor(private http: HttpClient) {
    }

    getPositionCount(cr: CustomerRequest): Observable<number> {
        return this.http.get<number>(this.positionsCustomerUrl, {
            headers: new HttpHeaders({'Accept': 'application/json'}),
            params: new HttpParams().set('request', btoa(JSON.stringify(cr)))
        });
    }

    getPositions(): Observable<string> {
        return this.http.get<string>(this.filePath);
    }

    postPositions(body: string): Observable<Response> {
        return this.http.post<Response>(this.positionsUserUrl, body);
    }

    getPositionsFromServer(ur: UserRequest): Observable<any> {
        let myParams = new HttpParams();
        myParams.append('start', (ur.start.getTime() * 1000).toString());
        myParams.append('end', (ur.end.getTime() * 1000).toString());
        return this.http.get<any>(this.positionsUserUrl, {
            headers: new HttpHeaders({'Accept': 'application/json'}),
            params: myParams
        });
    }
}
