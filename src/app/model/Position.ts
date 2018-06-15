import {Point} from 'geojson';

export class Position {
    timestamp: number;
    latitude: number;
    longitude: number;

    constructor(timestamp: number, point: Point) {
        this.timestamp = timestamp;
        this.latitude = point.coordinates[0];
        this.longitude = point.coordinates[1];
    }

}
