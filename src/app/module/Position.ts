import {Point} from 'geojson';

export class Position{
    timestamp: number;
    point: Point;

    constructor (timestamp: number, point: Point) {
        this.timestamp = timestamp;
        this.point = point;
    }

    getPoint(){
        return this.point;
    }
}