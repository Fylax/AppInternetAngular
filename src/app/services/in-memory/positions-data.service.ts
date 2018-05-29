import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Point} from 'geojson';

export class PositionsDataService implements InMemoryDbService {

    createDb() {
        const positions = [
             { timestamp: 1527500020, latitude: 45.064950, longitude: 7.661550 },
             { timestamp: 1527500025, latitude: 45.066970, longitude: 7.861550 }
            // { timestamp: 15693847, point: [45.064950, 7.661550] }
        ];
        return {positions};
    }}
