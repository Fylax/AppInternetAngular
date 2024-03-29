import {Polygon} from 'leaflet';

export class UserSearchRequest {
  area: Polygon;
  start: Date;
  end: Date;

  constructor() {
    this.start = new Date();
    this.start.setDate(this.start.getDate() - 2);
    this.end = new Date();
  }

  toJSON() {
    return {
      area: this.area.toGeoJSON().geometry,
      start: Math.trunc(this.start.getTime() / 1000),
      end: Math.trunc(this.end.getTime() / 1000)
    };
  }

}
