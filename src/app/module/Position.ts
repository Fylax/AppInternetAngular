import {Point} from 'geojson';

export class Position{
    timestamp: Date;
    point: Point;

    constructor (timestamp: Date, point: Point) {
        this.timestamp = timestamp;
        this.point = point;
    }

    getPoint(){
        return this.point;
    }
}