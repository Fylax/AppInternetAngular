import {Polygon} from 'geojson';

export class CustomerRequest {
  area: Polygon;
  start: Date;
  end: Date;

  constructor() {
    this.start = new Date(0);
    this.end = new Date();
  }
}
