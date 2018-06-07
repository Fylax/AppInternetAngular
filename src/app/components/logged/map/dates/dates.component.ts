import {Component} from "@angular/core";
import {MatDatepickerInputEvent} from "@angular/material";
import {DatesService} from "../../../../services/dates.service";
import {ShareMapInfoService} from "../../../../services/share-map-info.service";
import {FormControl, Validators} from '@angular/forms';
import {Moment} from 'moment';

@Component({
  selector: 'dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.css']
})
export class DatesComponent {

  disabled = false;

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
    const newDate = event.value;
    switch (type) {
      case 'start':
        this.shareInfoService.startDate = newDate;
        break;
      case 'end':
        this.shareInfoService.endDate = newDate;
    }
    this.setFormControlValidator(type);
  }

  setHour(type: string, event: FocusEvent) {
    const val = (event.currentTarget as HTMLInputElement).value;
    const value = parseInt(val, 10);
    if (isNaN(value) || (value >= 0 && value <= 23)) {
      switch (type) {
        case 'start':
          this.shareInfoService.startHours = value;
          break;
        case 'end':
          this.shareInfoService.endHours = value;
      }
    }
    this.setFormControlValidator(type);
  }

  setMinutes(type: string, event: FocusEvent) {
    const val = (event.currentTarget as HTMLInputElement).value;
    const value = parseInt(val, 10);
    if (isNaN(value) || (value >= 0 && value <= 59)) {
      switch (type) {
        case 'start':
          this.shareInfoService.startMinutes = value;
          break;
        case 'end':
          this.shareInfoService.endMinutes = value;
      }
    }
    this.setFormControlValidator(type);
  }

  setFormControlValidator(type: string): void {
    if (this.shareInfoService.customerRequest.start.getDate() ===
        this.shareInfoService.customerRequest.end.getDate() && this.shour.value >= this.ehour.value) {
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
    return d.toDate() <= this.shareInfoService.customerRequest.end;
  }

  filterEndDate = (d: Moment): boolean => {
    const newDate = new Date(this.shareInfoService.customerRequest.start);
    newDate.setDate(this.shareInfoService.customerRequest.start.getDate() - 1);
    return d.toDate() >= newDate && d.toDate() <= new Date();
  }
}