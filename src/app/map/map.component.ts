import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as L from 'leaflet';
import {Subscription} from 'rxjs';
import {DatesService} from '../dates/dates.service';
import {ApproximatedArchive} from '../model/approximated-archive';
import {Point} from '../model/point';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

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
  private subscription_: Subscription;
  private editableLayers = new L.FeatureGroup();
  private hidden = false;
  private map: L.Map;

  archives: ApproximatedArchive[];
  private markerLayers: L.LayerGroup;

  @Input() set setItems(value: ApproximatedArchive[]) {
    this.markerLayers.remove();
    this.markerLayers.clearLayers();
    this.archives = value;
    if (this.archives !== undefined) {
      for (let i = 0; i < this.archives.length; i++) {
        const curr_archive = this.archives[i];
        for (const pos of curr_archive.positions) {
          const currCircleMarker = MapComponent.createCircleMarker(curr_archive.color, pos);
          this.markerLayers.addLayer(currCircleMarker);
        }
      }
    }
    this.markerLayers.addTo(this.map);
  }

  @Output() polygonOutput = new EventEmitter();

  static createCircleMarker(colorByArchive: string, pos: Point) {
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

  constructor(datesService: DatesService) {
    this.subscription_ = datesService.datesShowed.subscribe(event => {
      this.hidden = event;
    });
    this.markerLayers = new L.LayerGroup();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription_.unsubscribe();
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

  onMapReady(map: L.Map) {
    this.map = map;
    this.map.addLayer(this.editableLayers);
    const polygon = this.createPolygonFromBounds(this.map.getBounds());
    this.polygonOutput.emit(polygon);
  }
}
