import {Polygon} from 'geojson';
import {LatLng} from "leaflet";

export class CustomerRequest {
  area: Polygon;
  center: LatLng;
  start: Date;
  end: Date;

  constructor() {
    this.start = new Date(0);
    this.end = new Date();
  }

  toJSON() {
    return {
      area: JSON.stringify(this.area),
      start: Math.trunc(this.start.getTime() / 1000),
      end: Math.trunc(this.end.getTime() / 1000)
    };
  }
  getEstimate() {
    // eventualmente se vogliamo adattare l'are del cerchio a quella del poligono contenitore...
  }

}
