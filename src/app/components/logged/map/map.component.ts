import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as L from 'leaflet';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {Subscription} from 'rxjs';
import {Point, Polygon} from 'geojson';
import {DatesService} from '../../../services/dates.service';
import {Archive} from '../../../model/Archive';
import {polygon} from 'leaflet';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit,  OnDestroy {

    editableLayers = new L.FeatureGroup();
    private subscription_: Subscription;
    leafletDirective: LeafletDirectiveWrapper;
    hidden = false;

    archives: Array<Archive>;
    @Input() set setItems(value: Array<Archive>) {
        this.archives = value;
    }
    @Output() polygonOutput = new EventEmitter();

    constructor(datesService: DatesService,
                leafletDirective: LeafletDirective) {
        this.subscription_ = datesService.datesShowed.subscribe(event => {
            this.hidden = event;
        });
        this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    }

    options = {
        zoomControl: false,
        layers: [
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            })
        ],
        zoom: 16,
        center: L.latLng(45.064950, 7.661550)
    };

    ngOnInit(): void {
        this.leafletDirective.init();
        this.leafletDirective.getMap().addLayer(this.editableLayers);

        const colorByUser = new Map();
         for (const curr_archive of this.archives) {
           for (const pos of curr_archive.positions) {
            const colorByArchive = this.getColorByUserID(colorByUser, curr_archive.username);
            const currCircleMarker = this.createCircleMarker(colorByArchive, pos);
            currCircleMarker
                .addTo(this.leafletDirective.getMap());
           }
        }
    }

    ngOnDestroy(): void {
        this.subscription_.unsubscribe();
        /// *** set the polygon's coordinates ***///
        const polygon = this.createPolygonFromBounds(this.leafletDirective.getMap().getBounds());
        this.polygonOutput.emit(polygon);
    }

    createCircleMarker(colorByArchive: string, pos: Point) {
        // Change the values of these options to change the symbol's appearance
        const options = {
            radius: 8,
            fillColor: colorByArchive,
            color: colorByArchive,
            weight: 1,
            opacity: 0,
            fillOpacity: 0.8
        };
        return L.circleMarker( L.latLng([pos.coordinates[0], pos.coordinates[1]]), options );
    }
    createPolygonFromBounds(latLngBounds) {
        const center = latLngBounds.getCenter();
        const latlngs = [];

        latlngs.push(latLngBounds.getSouthWest());
        latlngs.push({ lat: latLngBounds.getSouth(), lng: center.lng });
        latlngs.push(latLngBounds.getSouthEast());
        latlngs.push({ lat: center.lat, lng: latLngBounds.getEast() });
        latlngs.push(latLngBounds.getNorthEast());
        latlngs.push({ lat: latLngBounds.getNorth(), lng: this.leafletDirective.getMap().getCenter().lng });
        latlngs.push(latLngBounds.getNorthWest());
        latlngs.push({ lat: this.leafletDirective.getMap().getCenter().lat, lng: latLngBounds.getWest() });
        return L.polygon(latlngs);
    }

    getColorByUserID(colorByUser, userID) {

        if (colorByUser.has(userID)) {
            return colorByUser.get(userID);
        }
        let color;
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        color = "rgb(" + r + " ," + g + "," + b + ")";
        colorByUser.set(userID, color);
        return color;
    }
}
