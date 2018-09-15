import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import * as L from 'leaflet';
import {ApproximatedArchive} from '../model/approximated-archive';
import {Point} from '../model/point';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private editableLayers = new L.FeatureGroup();
  private map;

  private currPolygon;
  archives: ApproximatedArchive[];
  private markerLayers: L.LayerGroup;
  private screen_height: string;

  options = {
    zoomControl: true,
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 13,
    scrollWheelZoom: false,
    center: L.latLng(45.06495, 7.66155)
  };

  @Input() drawable: boolean;

  map_height: string;

  @Input() set mapHeight(value: string) {
    this.map_height = value;
  }

  @Input() set setItems(value: ApproximatedArchive[]) {
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
      this.markerLayers.addTo(this.map);
    }
  }

  @Output() polygonOutput = new EventEmitter();

  private static createCircleMarker(colorByArchive: string, pos: Point) {
    const options = {
      radius: 8,
      fillColor: colorByArchive,
      color: colorByArchive,
      weight: 1,
      opacity: 2,
      fillOpacity: 2
    };
    return L.circleMarker(L.latLng([pos.lat, pos.lon]), options);
  }

  constructor() {
    this.drawable = true;
    this.markerLayers = new L.LayerGroup();
  }

  ngOnInit() {
    this.screen_height = (window.innerHeight - 145).toLocaleString() + 'px';
  }

  /**
   * Create polygon from map bounds
   * @param latLngBounds
   */
  private createPolygonFromBounds(latLngBounds) {
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

  /**
   * If drawable is true or undefined set the draw options
   */
  onMapReady(map: L.Map) {
    this.map = map;
    this.map.addLayer(this.editableLayers);

    if (this.drawable !== undefined && this.drawable) {
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: this.editableLayers
        },
        position: 'topright',
        draw: {
          marker: false,
          circlemarker: false,
          rectangle: false,
          polyline: false,
          circle: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: 'red',
              message: '<strong>Non consentito!<strong>'
            },
          },
        }
      });
      this.map.addControl(drawControl);
    }
    this.map
        .on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
          if (e.type !== 'draw:created' && e.layerType !== 'polygon') {
            return;
          }
          this.editableLayers.addLayer(e.layer);
          this.currPolygon = (e.layer as L.Polygon);
          const controls = document.getElementsByClassName('leaflet-draw-toolbar');
          (controls[0] as HTMLDivElement).style.display = 'none';
          (controls[1] as HTMLDivElement).style.display = 'block';
          this.onMapChange();
        })
        .on(L.Draw.Event.DELETED, (e: L.DrawEvents.Deleted) => {
          if (e.layers.getLayers().length !== 0) {
            const controls = document.getElementsByClassName('leaflet-draw-toolbar');
            (controls[0] as HTMLDivElement).style.display = 'block';
            (controls[1] as HTMLDivElement).style.display = 'none';
            this.onMapChange();
          }
        })
        .on(L.Draw.Event.EDITED, (e: L.DrawEvents.Edited) => {
          const poly = (e.layers.getLayers()[0] as L.Polygon);
          if (poly !== undefined) {
            this.currPolygon = poly;
            this.onMapChange();
          }
        });
    this.onMapChange();
  }

  /**
   * For each map change emits the polygon in output
   */
  onMapChange() {
    if (this.editableLayers.getLayers().length === 0) {
      this.currPolygon = this.createPolygonFromBounds(this.map.getBounds());
    }
    this.polygonOutput.emit(this.currPolygon);
  }
}
