import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Purchase} from '../model/Purchase';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private url = environment.baseUrl + 'positions/customer/purchase';

  constructor(private http: HttpClient) { }

  getPurchaseList(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.url);
  }
}
