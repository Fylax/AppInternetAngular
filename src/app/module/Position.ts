import {Point} from './Point';

export class Position {
    timestamp: Date;
    point: Point;


    constructor(timestamp: Date, latitude: number, longitude: number) {
        this.timestamp = timestamp;
        this.point = new Point(latitude, longitude);
    }


}
