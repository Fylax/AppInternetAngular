import {InMemoryDbService} from 'angular-in-memory-web-api';

export class PositionsDataService implements InMemoryDbService {

    createDb() {
        const positions = [
            { timestamp: 15693847, latitude: 45.064950, longitude: 7.661550 }
            // { timestamp:15693847, new Point(45.064950, 7.661550) }
        ];
        return {positions};
    }}
