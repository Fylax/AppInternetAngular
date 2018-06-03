import {Component, Input} from '@angular/core';
import * as L from 'leaflet';
import {FormControl, Validators} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material';
import {Moment} from 'moment';
import {ShareMapInfoService} from '../../services/share-map-info.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @Input() customer: boolean;
  @Input() buy: boolean;

  startDateSet = false;
  endDateSet = false;

  startDate: Date;
  endDate: Date;

  constructor(private shareInfoService: ShareMapInfoService) {
    this.startDate = new Date(0);
    this.endDate = new Date();
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

  setDate(type: string, event: MatDatepickerInputEvent<Moment>) {
    let date: Date;
    switch (type) {
      case 'start':
        date = this.startDate;
        this.startDateSet = true;
        break;
      case 'end':
        date = this.endDate;
        this.endDateSet = true;
    }
    const newDate = event.value;
    date.setFullYear(newDate.year(), newDate.month(), newDate.date());
    this.setFormControlValidator(type);
    this.checkDateReady();
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
          date = this.startDate;
          break;
        case 'end':
          date = this.endDate;
      }
      date.setHours(value);
    }
    this.setFormControlValidator(type);
    this.checkDateReady();
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
          date = this.startDate;
          break;
        case 'end':
          date = this.endDate;
      }
      date.setMinutes(value);
    }
    this.setFormControlValidator(type);
    this.checkDateReady();
  }

  setFormControlValidator(type: string): void {
    if (this.startDate.getDate() === this.endDate.getDate() && this.shour.value >= this.ehour.value) {
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
    return d.toDate() <= this.endDate;
  }

  filterEndDate = (d: Moment): boolean => {
    const newDate = new Date(this.startDate);
    newDate.setDate(this.startDate.getDate() - 1);
    return d.toDate() >= newDate && d.toDate() <= new Date();
  }

  checkDateReady(): void {
    if (this.shour.valid &&
        this.sminutes.valid &&
        this.ehour.valid &&
        this.eminutes.valid &&
        this.startDateSet &&
        this.endDateSet) {
      this.shareInfoService.setStartDate(this.startDate);
      this.shareInfoService.setEndDate(this.endDate);
      this.shareInfoService.setDateReady(true);
    } else {
     this.shareInfoService.setDateReady(false);
    }
  }

}