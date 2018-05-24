import {Component} from '@angular/core';
import {circle, latLng, polygon, tileLayer} from "leaflet";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  options = {
    zoomControl: true,
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    ],
    zoom: 10,
    center: latLng(45.064950, 7.661550)
  };

  layersControl = {

  }
}
