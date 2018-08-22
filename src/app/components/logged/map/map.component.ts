import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as L from 'leaflet';
import {Subscription} from 'rxjs';
import {DatesService} from '../../../services/dates.service';
import {ApproximatedArchive} from '../../../model/approximated-archive';
import {Point} from '../../../model/point';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {

  editableLayers = new L.FeatureGroup();
  private subscription_: Subscription;
  hidden = false;
  map: L.Map;

  archives: ApproximatedArchive[];

  @Input() set setItems(value: ApproximatedArchive[]) {
    this.archives = value;
    const colorByUser = new Map();
    if (this.archives !== undefined) {
      for (let i = 0; i < this.archives.length; i++) {
        const curr_archive = this.archives[i];
        for (const pos of curr_archive.positions) {
          const colorByArchive = this.getColorByUserID(colorByUser, curr_archive.username);
          const currCircleMarker = this.createCircleMarker(colorByArchive, pos);
          currCircleMarker.addTo(this.map);
        }
      }
    }
  }

  @Output() polygonOutput = new EventEmitter();

  constructor(datesService: DatesService) {
    this.subscription_ = datesService.datesShowed.subscribe(event => {
      this.hidden = event;
    });
  }

  options = {
    zoomControl: true,
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 15,
    center: L.latLng(45.06495, 7.66155)
  };

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription_.unsubscribe();
  }

  createCircleMarker(colorByArchive: string, pos: Point) {
    const options = {
      radius: 8,
      fillColor: colorByArchive,
      color: colorByArchive,
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.5
    };
    return L.circleMarker(L.latLng([pos.lat, pos.lon]), options);
  }

  createPolygonFromBounds(latLngBounds) {
    const center = latLngBounds.getCenter();
    const latlngs = [];

    latlngs.push(latLngBounds.getSouthWest());
    latlngs.push({lat: latLngBounds.getSouth(), lng: center.lng});
    latlngs.push(latLngBounds.getSouthEast());
    latlngs.push({lat: center.lat, lng: latLngBounds.getEast()});
    latlngs.push(latLngBounds.getNorthEast());
    latlngs.push({lat: latLngBounds.getNorth(), lng: this.map.getCenter().lng});
    latlngs.push(latLngBounds.getNorthWest());
    latlngs.push({lat: this.map.getCenter().lat, lng: latLngBounds.getWest()});
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
    color = 'rgb(' + r + ' ,' + g + ',' + b + ')';
    colorByUser.set(userID, color);
    return color;
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.map.addLayer(this.editableLayers);
    const polygon = this.createPolygonFromBounds(this.map.getBounds());
    this.polygonOutput.emit(polygon);
  }
}
