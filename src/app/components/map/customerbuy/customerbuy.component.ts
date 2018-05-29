import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {FormControl, Validators} from '@angular/forms';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {Polygon} from 'geojson';
import {CustomerRequest} from './CustomerRequest';
import {MatDatepickerInputEvent} from '@angular/material';
import {Moment} from 'moment';
import {Position} from '../../../module/Position';
import {PositionsService} from '../../../services/positions.service';

@Component({
  selector: 'buy',
  templateUrl: './customerbuy.component.html',
  styleUrls: ['./customerbuy.component.css']
})
export class CustomerbuyComponent implements OnInit {

  positions: Position[];
  startDateSet = false;
  endDateSet = false;
  polygonCreated = false;

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
      Validators.min(0),
      Validators.max(23)
    ]
  });
  sminutes = new FormControl('', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.min(0),
      Validators.max(59)
    ]
  });
  ehour = new FormControl('', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.min(0),
      Validators.max(23)
    ]
  });
  eminutes = new FormControl('', {
    updateOn: 'blur',
    validators: [
      Validators.required,
      Validators.min(0),
      Validators.max(59)
    ]
  });

  data: CustomerRequest;

  constructor(private positionsService: PositionsService, leafletDirective: LeafletDirective) {
    this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    this.data = new CustomerRequest();
  }

  setDate(type: string, event: MatDatepickerInputEvent<Moment>) {
    let date: Date;
    switch (type) {
      case 'start':
        date = this.data.start;
        this.startDateSet = true;
        break;
      case 'end':
        date = this.data.end;
        this.endDateSet = true;
    }
    const newDate = event.value;
    date.setFullYear(newDate.year(), newDate.month(), newDate.date());
    this.setFormControlValidator(type);
    this.checkConfirmationReady();
  }

  ngOnInit() {
    this.getPositions();
    this.leafletDirective.init();
    this.leafletDirective.getMap()
        .on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
          if (e.type !== 'draw:created' && e.layerType !== 'polygon') {
            return;
          }
          const area = (e.layer as L.Polygon);
          this.data.area = area.toGeoJSON().geometry as Polygon;
          this.data.center = area.getBounds().getCenter();
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
          this.data.center = null;
          this.data.area = null;
          this.polygonCreated = false;
          this.checkConfirmationReady();
        })
        .on(L.Draw.Event.EDITED, (e: L.DrawEvents.Edited) => {
          const area = (e.layers.getLayers()[0] as L.Polygon);
          this.data.area = area.toGeoJSON().geometry as Polygon;
          this.data.center = area.getBounds().getCenter();
          this.checkConfirmationReady();
        });
  }

  ngAfterViewInit() {
    const controls = document.getElementsByClassName('leaflet-draw-toolbar');
    (controls[0] as HTMLDivElement).style.display = 'block';
    (controls[1] as HTMLDivElement).style.display = 'none';
  }

  setHour(type: string, event: FocusEvent) {
    const val = (event.currentTarget as HTMLInputElement).value;
    if (val.length === 0) {
      return;
    }
    const value = parseInt(val, 10);
    if (value >= 0 && value <= 23) {
      let date: Date;
      switch (type) {
        case 'start':
          date = this.data.start;
          break;
        case 'end':
          date = this.data.end;
      }
      date.setHours(value);
    }
    this.setFormControlValidator(type);
    this.checkConfirmationReady();
  }

  setMinutes(type: string, event: FocusEvent) {
    const val = (event.currentTarget as HTMLInputElement).value;
    if (val.length === 0) {
      return;
    }
    const value = parseInt(val, 10);
    if (value >= 0 && value <= 59) {
      let date: Date;
      switch (type) {
        case 'start':
          date = this.data.start;
          break;
        case 'end':
          date = this.data.end;
      }
      date.setMinutes(value);
    }
    this.setFormControlValidator(type);
    this.checkConfirmationReady();
  }

  setFormControlValidator(type: string): void {
    if (this.data.start.getDate() === this.data.end.getDate() && this.shour.value >= this.ehour.value) {
      this.shour.setValidators([Validators.required, Validators.max(this.ehour.value), Validators.min(0)]);
      this.ehour.setValidators([Validators.required, Validators.min(this.shour.value), Validators.max(23)]);
      if (this.shour.value === this.ehour.value && this.sminutes.value >= this.eminutes.value) {
        this.sminutes.setValidators([Validators.required, Validators.max(this.eminutes.value), Validators.min(0)]);
        this.eminutes.setValidators([Validators.required, Validators.min(this.sminutes.value), Validators.max(59)]);
      } else {
        this.resetControlMinutesValidator();
      }
      if (type === 'start') {
        this.shour.updateValueAndValidity();
        this.sminutes.updateValueAndValidity();
      } else {
        this.ehour.updateValueAndValidity();
        this.eminutes.updateValueAndValidity();
      }
    } else {
      this.resetControlValidator();
    }
  }

  resetControlValidator(): void {
    this.shour.setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(23)
    ]);
    this.ehour.setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(23)
    ]);
    this.resetControlMinutesValidator();
    this.shour.updateValueAndValidity();
    this.ehour.updateValueAndValidity();
  }

  resetControlMinutesValidator(): void {
    this.sminutes.setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(59)
    ]);
    this.eminutes.setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(59)
    ]);
    this.sminutes.updateValueAndValidity();
    this.eminutes.updateValueAndValidity();
  }

  filterStartDate = (d: Moment): boolean => {
    return d.toDate() <= this.data.end;
  }

  filterEndDate = (d: Moment): boolean => {
    const newDate = new Date(this.data.start);
    newDate.setDate(this.data.start.getDate() - 1);
    return d.toDate() >= newDate && d.toDate() <= new Date();
  }

  getPositions(): void {
    this.positionsService.getPositions()
        .subscribe(positions => this.positions = positions);
  }

  confirmationClick() {
    const polygon = this.data.area;
    const self = this; // it is necessary to access this context in the callback
    const filteredPositions = this.positions
        .filter(function (p) {
          return p.timestamp >= self.data.start.getTime() / 1000 &&
              p.timestamp <= self.data.end.getTime() / 1000;
        });
    let count = 0;
    for (const pos of filteredPositions) {
      if (this.checkPoint(pos.getPoint(), polygon.coordinates[0][0])) {
        count++;
      }
      // print count into draw-polygon...
    }
  }

  checkPoint(point, poly) {
    // ray-casting algorithm based on
    const coords = (poly.type === 'Polygon') ? [poly.coordinates] : poly.coordinates;
    let insideBox = false;
    for (let i = 0; i < coords.length; i++) {
      if (this.pointInBoundingBox(point, this.boundingBoxAroundPolyCoords(coords[i]))) {
        insideBox = true;
      }
    }
    if (!insideBox) {
      return false;
    }

    let insidePoly = false;
    for (let i = 0; i < coords.length; i++) {
      if (this.pnpoly(point.coordinates[1], point.coordinates[0], coords[i])) {
        insidePoly = true;
      }
    }

    return insidePoly;
  }

  pointInBoundingBox = function (point, bounds) {
    return !(point.coordinates[1] < bounds[0][0]
        || point.coordinates[1] > bounds[1][0]
        || point.coordinates[0] < bounds[0][1]
        || point.coordinates[0] > bounds[1][1]);
  };

  boundingBoxAroundPolyCoords(coords) {
    let xAll = [], yAll = [];

    for (let i = 0; i < coords[0].length; i++) {
      xAll.push(coords[0][i][1]);
      yAll.push(coords[0][i][0]);
    }

    xAll = xAll.sort(function (a, b) {
      return a - b;
    });
    yAll = yAll.sort(function (a, b) {
      return a - b;
    });

    return [[xAll[0], yAll[0]], [xAll[xAll.length - 1], yAll[yAll.length - 1]]];
  }

  pnpoly(x, y, coords) {
    const vert = [[0, 0]];

    for (let i = 0; i < coords.length; i++) {
      for (let j = 0; j < coords[i].length; j++) {
        vert.push(coords[i][j]);
      }
      vert.push(coords[i][0]);
      vert.push([0, 0]);
    }
  }

  checkConfirmationReady(): void {
    if (this.shour.valid &&
        this.sminutes.valid &&
        this.ehour.valid &&
        this.eminutes.valid &&
        this.startDateSet &&
        this.endDateSet &&
        this.polygonCreated) {
      document.getElementById("confirmation-button").style.display = 'block';
    } else {
      document.getElementById("confirmation-button").style.display = 'none';
    }
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

