import { Injectable } from '@angular/core';
import {Polygon} from 'leaflet';
import {Polygon as GeoJsonPolygon} from 'geojson';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareMapInfoService {

  startDate: Date;
  endDate: Date;
  polygon: Polygon;
  area: GeoJsonPolygon;
  private dateReadySource = new Subject<boolean>();
  dateReady$ = this.dateReadySource.asObservable();



  constructor() {
    this.startDate = new Date(0);
    this.endDate = new Date();
  }

  setStartDate(date: Date): void {
    this.startDate.setDate(date.getDate());
  }

  setEndDate(date: Date): void {
    this.endDate.setDate(date.getDate());
  }

  setDateReady(flag: boolean): void {
    this.dateReadySource.next(flag);
  }
}
