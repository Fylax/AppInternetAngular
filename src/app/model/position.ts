import {Point} from 'geojson';

export class Position {
    timestamp: number;
    position: Point;


    constructor(timestamp: number, point: Point) {
        this.timestamp = timestamp;
        this.position = point;
    }

}
