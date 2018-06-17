import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private links: string[] = [];
  promise;

  constructor(private http: HttpClient) {
    this.promise = new Promise((resolve, reject)  => {
      this.http.get(environment.baseUrl)
          .subscribe(json => {
            this.parseJson(json);
            resolve(this.links);
          });
    });
  }

  private parseJson(json: any) {
    for (const key in json._links) {
      this.links[key] = json._links[key].href.split('{')[0];
    }
  }
}

