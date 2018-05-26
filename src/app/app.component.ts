import {Component} from '@angular/core';
import * as L from 'leaflet';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  customer = true;

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

  drawOptions = {
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
      }
    }
  };

  hour = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.max(23)
  ]);

  minutes = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.max(59)
  ]);
}