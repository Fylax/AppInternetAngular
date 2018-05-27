import {Polygon} from "geojson";

export class CustomerRequest {
    area: Polygon;
    start: Date;
    end: Date;

    constructor() {
        this.start = new Date();
        this.end = new Date();
    }
}