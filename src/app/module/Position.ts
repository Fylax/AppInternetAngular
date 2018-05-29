import {Point} from 'geojson';

export class Position {
    timestamp: number;
    latitude: number;
    longitude: number;

    constructor(timestamp: number, latitude: number, longitude: number) {
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;
    }

}
