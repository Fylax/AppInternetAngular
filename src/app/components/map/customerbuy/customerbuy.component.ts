import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {FormControl, Validators} from '@angular/forms';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {Polygon} from 'geojson';
import {CustomerRequest} from './CustomerRequest';
import {MatDatepickerInputEvent} from '@angular/material';
import {Moment} from 'moment';

@Component({
  selector: 'buy',
  templateUrl: './customerbuy.component.html',
  styleUrls: ['./customerbuy.component.css']
})
export class CustomerbuyComponent implements OnInit {
  leafletDirective: LeafletDirectiveWrapper;
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
  shour = new FormControl('', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.min(1),
      Validators.max(23)
    ]
  });
  sminutes = new FormControl('', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.min(1),
      Validators.max(59)
    ]
  });
  ehour = new FormControl('', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.min(1),
      Validators.max(23)
    ]
  });
  eminutes = new FormControl('', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.min(1),
      Validators.max(59)
    ]
  });

  data: CustomerRequest;

  constructor(leafletDirective: LeafletDirective) {
    this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    this.data = new CustomerRequest();
  }

  setDate(type: string, event: MatDatepickerInputEvent<Moment>) {
    let date: Date;
    switch (type) {
      case 'start':
        date = this.data.start;
        break;
      case 'end':
        date = this.data.end;
    }
    const newDate = event.value;
    date.setFullYear(newDate.year(), newDate.month(), newDate.date());
  }

  setHour(type: string, event: FocusEvent) {
    const value = (event.currentTarget as HTMLInputElement).value;
    if (value.length === 0) {
      return;
    }
    let date: Date;
    switch (type) {
      case 'start':
        date = this.data.start;
        break;
      case 'end':
        date = this.data.end;
    }
    date.setUTCHours(parseInt(value, 10));
  }

  setMinutes(type: string, event: FocusEvent) {
    const value = (event.currentTarget as HTMLInputElement).value;
    if (value.length === 0) {
      return;
    }
    let date: Date;
    switch (type) {
      case 'start':
        date = this.data.start;
        break;
      case 'end':
        date = this.data.end;
    }
    date.setUTCMinutes(parseInt(value, 10));
  }

  filterStartDate = (d: Moment): boolean => {
    return d.toDate() <= this.data.end;
  }

  filterEndDate = (d: Moment): boolean => {
    const newDate = new Date(this.data.start);
    newDate.setDate(this.data.start.getDate() - 1);
    return d.toDate() >= newDate && d.toDate() <= new Date();
  }

  buy(event: MouseEvent) {
    const data = this.data.area;

    // here we can to do something with the polygon... (nothing for the moment)
    const convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
  }

  ngOnInit() {
    this.leafletDirective.init();
    this.leafletDirective.getMap().on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
      if (e.type !== 'draw:created' && e.layerType !== 'polygon') {
        return;
      } else if (this.data.area) { // already defined
        // disabilitare bottone per disegno nuovo poligono?
        return;
      }
      const area = (e.layer as L.Polygon);
      this.data.area = area.toGeoJSON().geometry as Polygon;
      this.data.center = area.getBounds().getCenter();
    });
  }
}
