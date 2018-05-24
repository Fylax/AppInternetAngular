import {Component} from '@angular/core';
import {circle, latLng, polygon, tileLayer} from "leaflet";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  options = {
    zoomControl: false,
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 16,
    center: latLng(45.064950, 7.661550)
  };

  layersControl = {}
}
