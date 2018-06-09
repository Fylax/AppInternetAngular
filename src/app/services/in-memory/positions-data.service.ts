/*import {InMemoryDbService, STATUS, getStatusText} from 'angular-in-memory-web-api';
import {Point} from 'geojson';
import {Position} from "../../module/Position";
import {Observable} from "rxjs";
import {ParsedRequestUrl, RequestInfo, RequestInfoUtilities, ResponseOptions} from 'angular-in-memory-web-api';
import {CustomerRequest} from "../../components/logged/map/customerbuy/CustomerRequest";

export class PositionsDataService implements InMemoryDbService {

  private positions = [
    {timestamp: 1527500020, latitude: 45.064950, longitude: 7.661550},
    {timestamp: 1527500025, latitude: 45.066970, longitude: 7.861550}
    // { timestamp: 15693847, point: [45.064950, 7.661550] }
  ];

  createDb() {
    return this.positions;
  }

  get(reqInfo: RequestInfo): Observable<Response> {
    return reqInfo.utils.createResponse$(() => {
          const cr = JSON.parse(atob(reqInfo.query.get('request')[0]));
          cr.start = new Date(cr.start);
          cr.end = new Date(cr.end);
          cr.area = JSON.parse(cr.area);

          const body = [];

          for (const pos of this.positions) {
            if (pos.timestamp > cr.start.getTime() && pos.timestamp < cr.end.getTime() &&
                this.checkPoint(pos.latitude, pos.longitude, cr.area.coordinates[0])) {
              body.push(pos);
            }
          }

          const options: ResponseOptions = {
            body: body.length,
            status: STATUS.OK
          };

          options.statusText = getStatusText(options.status);
          options.headers = reqInfo.headers;
          options.url = reqInfo.url;
          return options;
        }
    );
  }

  private checkPoint(ltd, lng, vs): boolean {
    // const x = point[0], y = point[1];

    const x = lng, y = ltd;

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];

      const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  }
}
*/