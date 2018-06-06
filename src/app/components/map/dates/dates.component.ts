import {Component} from "@angular/core";
import {MatDatepickerInputEvent} from "@angular/material";
import {DatesService} from "../../../services/dates.service";
import {ShareMapInfoService} from "../../../services/share-map-info.service";
import {FormControl, Validators} from '@angular/forms';
import {Moment} from 'moment';

@Component({
  selector: 'dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.css']
})
export class DatesComponent {

  disabled = false;

  startDateSet = false;
  endDateSet = false;

  startDate: Date;
  endDate: Date;

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

  constructor(private shareInfoService: ShareMapInfoService, datesService: DatesService) {
    this.startDate = new Date(0);
    this.endDate = new Date();
    datesService.datesStatus.subscribe(event => {
      this.disabled = event;
      if (this.disabled) {
        this.shour.disable();
        this.sminutes.disable();
        this.ehour.disable();
        this.eminutes.disable();
      } else {
        this.shour.enable();
        this.sminutes.enable();
        this.ehour.enable();
        this.eminutes.enable();
      }
    });
  }

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
