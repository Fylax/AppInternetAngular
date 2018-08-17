import {Point} from 'geojson';

export class Archive {
    archiveID: number;
    username: string;
    timestamp: Array<number>;
    positions: Array<Point>;
}
