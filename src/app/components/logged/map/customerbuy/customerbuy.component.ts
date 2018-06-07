import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {CustomerRequest} from './CustomerRequest';
import {PositionsService} from '../../../../services/positions.service';
import {Subscription} from 'rxjs';
import {ShareMapInfoService} from '../../../../services/share-map-info.service';
import {DatesService} from "../../../../services/dates.service";

@Component({
  selector: 'buy',
  templateUrl: './customerbuy.component.html',
  styleUrls: ['./customerbuy.component.css']
})
export class CustomerbuyComponent implements OnInit, AfterViewInit, OnDestroy {

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

  constructor(private shareInfoService: ShareMapInfoService,
              private positionsService: PositionsService,
              datesService: DatesService,
              leafletDirective: LeafletDirective) {
    datesService.enableDates();
    this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    if (this.shareInfoService.polygon !== undefined) {
      this.editableLayers.addLayer(this.shareInfoService.polygon);
    }
  }

  ngOnInit() {
    this.leafletDirective.init();
    this.leafletDirective.getMap().addLayer(this.editableLayers);
    this.leafletDirective.getMap()
        .on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
          if (e.type !== 'draw:created' && e.layerType !== 'polygon') {
            return;
          }
          this.shareInfoService.polygon = (e.layer as L.Polygon);
          const controls = document.getElementsByClassName('leaflet-draw-toolbar');
          (controls[0] as HTMLDivElement).style.display = 'none';
          (controls[1] as HTMLDivElement).style.display = 'block';
        })
        .on(L.Draw.Event.DELETED, (e: L.DrawEvents.Deleted) => {
          if (e.layers.getLayers().length !== 0) {
            const controls = document.getElementsByClassName('leaflet-draw-toolbar');
            (controls[0] as HTMLDivElement).style.display = 'block';
            (controls[1] as HTMLDivElement).style.display = 'none';
            this.shareInfoService.polygon = null;
          }
        })
        .on(L.Draw.Event.EDITED, (e: L.DrawEvents.Edited) => {
          const poly = (e.layers.getLayers()[0] as L.Polygon);
          if (poly !== undefined) {
            this.shareInfoService.polygon = poly;
          }
        });
  }

  ngAfterViewInit() {
    const controls = document.getElementsByClassName('leaflet-draw-toolbar');
    this.subscription = this.shareInfoService.dateReady.subscribe(ready => {
      if (ready) {
        document.getElementById('confirmation-button').style.display = 'block';
      } else {
        document.getElementById('confirmation-button').style.display = 'none';
      }
    });
    if (this.shareInfoService.polygon !== undefined) {
      (controls[0] as HTMLDivElement).style.display = 'none';
      (controls[1] as HTMLDivElement).style.display = 'block';
    } else {
      (controls[0] as HTMLDivElement).style.display = 'block';
      (controls[1] as HTMLDivElement).style.display = 'none';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
