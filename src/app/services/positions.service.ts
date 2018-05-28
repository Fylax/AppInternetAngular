import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Position} from '../module/Position';

@Injectable({
    providedIn: 'root'
})
export class PositionsService {

    private positionsUrl = '/positions';  // URL to web api

    constructor(private http: HttpClient) {
    }
/**
    getPositions(timestamp: Date): Observable<Position[]> {
        const currentUrl = `${this.positionsUrl}/${timestamp}`;
        return this.http.get<Position[]>(currentUrl);
        //.pipe(catchError(this.handleError('getPositions', [])))           //after add polygon and to implement handleError<T> ?!?!
    }
   **/

    //in assenza di comunicazione col server, faccio un fittizia get su tutte le positions e filtro dopo...
    getPositions(): Observable<Position[]> {
        return this.http.get<Position[]>(this.positionsUrl);
    }
}
