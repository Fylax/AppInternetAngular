import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {FormControl, Validators} from '@angular/forms';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {Polygon} from 'geojson';
import {CustomerRequest} from './CustomerRequest';
import {MatDatepickerInputEvent} from '@angular/material';
import {Moment} from 'moment';
import {Position} from '../../../module/Position';
import {PositionsService} from '../../../services/positions.service';
import {of, Subscription} from 'rxjs';
import {DomUtil, FeatureGroup} from 'leaflet';
import getPosition = DomUtil.getPosition;
import {ShareMapInfoService} from '../../../services/share-map-info.service';

@Component({
  selector: 'buy',
  templateUrl: './customerbuy.component.html',
  styleUrls: ['./customerbuy.component.css']
})
export class CustomerbuyComponent implements OnInit, AfterViewInit, OnDestroy {
  polygonCreated = false;
  dateReady = false;
  subscription: Subscription;
  editableLayers = new L.FeatureGroup();

  leafletDirective: LeafletDirectiveWrapper;
  drawOptions = {
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
        allowIntersection: false, // Restricts shapes to simple polygons
        drawError: {
          color: 'red', // Color the shape will turn when intersects
          message: '<strong>Attenzione<strong> i poligoni non possono autointersecarsi' // Message that will show when intersect
        },
      },
    }
  };

  data: CustomerRequest;

  constructor(private shareInfoService: ShareMapInfoService,
              private positionsService: PositionsService,
              leafletDirective: LeafletDirective) {
    if (this.shareInfoService.customerRequest != null) {
      this.dateReady = true;
      this.data = this.shareInfoService.customerRequest;
      this.polygonCreated = true;
      this.editableLayers.addLayer(this.shareInfoService.customerRequest.polygon);
    } else {
      this.data = new CustomerRequest();
    }
    this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    this.subscription = this.shareInfoService.dateReady$.subscribe(
        flag => {
          this.dateReady = flag;
          this.checkConfirmationReady();
        }
    );
  }

  ngOnInit() {
    this.leafletDirective.init();
    this.leafletDirective.getMap().addLayer(this.editableLayers);
    this.leafletDirective.getMap()
        .on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
          if (e.type !== 'draw:created' && e.layerType !== 'polygon') {
            return;
          }
          const area = (e.layer as L.Polygon);
          this.data.area = area.toGeoJSON().geometry as Polygon;
          this.data.polygon = area;
          const controls = document.getElementsByClassName('leaflet-draw-toolbar');
          (controls[0] as HTMLDivElement).style.display = 'none';
          (controls[1] as HTMLDivElement).style.display = 'block';
          this.polygonCreated = true;
          this.checkConfirmationReady();
        })
        .on(L.Draw.Event.DELETED, () => {
          const controls = document.getElementsByClassName('leaflet-draw-toolbar');
          (controls[0] as HTMLDivElement).style.display = 'block';
          (controls[1] as HTMLDivElement).style.display = 'none';
          this.data.polygon = null;
          this.data.area = null;
          this.polygonCreated = false;
          this.checkConfirmationReady();
        })
        .on(L.Draw.Event.EDITED, (e: L.DrawEvents.Edited) => {
          const area = (e.layers.getLayers()[0] as L.Polygon);
          if (area !== undefined) {
            this.data.area = area.toGeoJSON().geometry as Polygon;
            this.data.polygon = area;
          }
          this.checkConfirmationReady();
        });
  }

  ngAfterViewInit() {
    const controls = document.getElementsByClassName('leaflet-draw-toolbar');
    if (this.polygonCreated) {
      (controls[0] as HTMLDivElement).style.display = 'none';
      (controls[1] as HTMLDivElement).style.display = 'block';
      document.getElementById('confirmation-button').style.display = 'block';
    } else {
      (controls[0] as HTMLDivElement).style.display = 'block';
      (controls[1] as HTMLDivElement).style.display = 'none';
    }
  }

  checkConfirmationReady(): void {
    if (this.dateReady && this.polygonCreated) {
      this.data.start = this.shareInfoService.startDate;
      this.data.end = this.shareInfoService.endDate;
      this.shareInfoService.setCustomerRequest(this.data);
      document.getElementById('confirmation-button').style.display = 'block';
    } else {
      document.getElementById('confirmation-button').style.display = 'none';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

/*
putMarker(point: Point){
        L.marker([45.06599, 7.661570], {
          icon: icon({
              iconSize: [45, 51],
              iconAnchor: [33, 61],
              iconUrl: 'assets/meMedesimoCorrado.png'
              //shadowUrl: 'assets/meMedesimoCorrado.png'
          })
      }).addTo(this.leafletDirective.getMap());
      }
*/

