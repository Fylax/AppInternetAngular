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
        const myIcon = L.icon({
            iconUrl: `${environment.baseIcons}my-icon.png`,
            iconSize: [52, 65] // size of the icon
        });
        this.leafletDirective.init();
        this.leafletDirective.getMap().addLayer(this.editableLayers);
        this.leafletDirective.getMap()
            .on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
                if (e.type === 'draw:created' && e.layerType === 'marker') {
                        L.marker((e.layer as L.Marker).getLatLng(), {
                            icon: myIcon
                        }).addTo(this.leafletDirective.getMap());
                } else {
                    return;
                }
            })
            .on(L.Draw.Event.EDITED, (e: L.DrawEvents.Edited) => {
                const marker = (e.layers.getLayers()[0] as L.Marker);       // TODO l'ultimo marker? qualisasi..?
                if (marker !== undefined) {
                    this.shareInfoService.marker = marker;
                }
            });
    }


}
