import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {PositionsService} from '../../../../services/positions.service';
import {ShareMapInfoService} from '../../../../services/share-map-info.service';
import {SpinnerService} from '../../../../services/spinner.service';
import {environment} from '../../../../../environments/environment';
import {Marker} from 'leaflet';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    editableLayers = new L.FeatureGroup();

    leafletDirective: LeafletDirectiveWrapper;
    drawOptions = {
        edit: {
            featureGroup: this.editableLayers
        },
        position: 'topright',
        draw: {
            marker: true,
            circlemarker: false,
            rectangle: false,
            polyline: false,
            circle: false,
            polygon: false
        }
    };

    constructor(private shareInfoService: ShareMapInfoService,
                private positionsService: PositionsService,
                spinner: SpinnerService,
                leafletDirective: LeafletDirective) {
        spinner.hideSpinner();
        this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    }

    ngOnInit() {
        let myIcon = L.icon({
            iconUrl: environment.baseUrl + 'src/assets/my-icon.png',
            // iconUrl: 'http://joshuafrazier.info/images/firefox.svg',
            iconSize: [38, 95], // size of the icon
        });
        this.leafletDirective.init();
        this.leafletDirective.getMap().addLayer(this.editableLayers);
        this.leafletDirective.getMap()
            .on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
                if (e.type === 'draw:created' && e.layerType === 'marker') {
                        L.marker((e.layer as Marker).getLatLng(), {
                            icon: myIcon
                        }).addTo(this.leafletDirective.getMap());
                } else {
                    return;
                }
            })
            .on('draw:edited', function (e) {
                this.editableLayers.eachLayer(function (layer) {
                    if (layer instanceof L.Marker) {
                        L.marker(layer.getLatLng(), {
                            icon: myIcon
                        }).addTo(this.leafletDirective.getMap());
                    }
                });
            });
    }


}
