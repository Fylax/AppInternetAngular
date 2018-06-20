import {Component, OnDestroy} from '@angular/core';
import * as L from 'leaflet';
import {Subscription} from 'rxjs';
import {DatesService} from '../../../services/dates.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnDestroy {

  private subscription_: Subscription;

  hidden = false;

  constructor(datesService: DatesService) {
    this.subscription_ = datesService.datesShowed.subscribe(event => {
      this.hidden = event;
    });
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

  ngOnDestroy(): void {
    this.subscription_.unsubscribe();
  }

}
