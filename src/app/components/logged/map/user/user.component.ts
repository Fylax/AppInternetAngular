import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {PositionsService} from '../../../../services/positions.service';
import {ShareMapInfoService} from '../../../../services/share-map-info.service';
import {SpinnerService} from '../../../../services/spinner.service';
import {HttpClient} from '@angular/common/http';
import {CustomerRequest} from '../customer/CustomerRequest';
import {catchError, first, map} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';


const iconUrl = 'assets/my-icon.png';
const myIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [60, 65] // size of the icon
});
L.Marker.prototype.options.icon = myIcon;


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    editableLayers = new L.FeatureGroup();
    leafletDirective: LeafletDirectiveWrapper;

    constructor(private shareInfoService: ShareMapInfoService,
                private positionsService: PositionsService,
                private http: HttpClient,
                private spinner: SpinnerService,
                leafletDirective: LeafletDirective) {
        spinner.hideSpinner();
        this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    }

    ngOnInit() {
        this.leafletDirective.init();
        this.leafletDirective.getMap().addLayer(this.editableLayers);

        var array2 = new Array();
        this.positionsService.getPositions()
            .pipe(first())
            .subscribe(data => {
                var array = data.positions;
                while (array.length > 0) {
                    const pos = array.pop();
                    L.marker(L.latLng([pos.position.coordinates[1], pos.position.coordinates[0]]), {
                            icon: myIcon
                        }
                    )
                        .bindPopup(pos.timestamp.toString())    //non ricordo se la data possiamo visualizzarla per privacy...
                        .addTo(this.leafletDirective.getMap());

                array2.push(pos);
                }
                //this.spinner.showSpinner();
                this.positionsService.postPositions(array2.toString())
                    .pipe(
                        first(),
                        catchError((error: Response) => {
                            if (error.status === 500) {
                                this.spinner.hideSpinner();
                                return throwError(error);
                            }
                        })
                    );
            });

    }


}
