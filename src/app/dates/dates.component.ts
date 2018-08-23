import {Component, EventEmitter, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material';
import {DatesService} from './dates.service';
import {Moment} from 'moment';

@Component({
  selector: 'dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.css']
})
export class DatesComponent {

  form = this.datesService.form;

  @Output() dateChange: EventEmitter<{ start: Date, end: Date }> = this.datesService.dateChange;
  @Output() valid: EventEmitter<boolean> = this.datesService.valid;

  constructor(private datesService: DatesService) {
  }

  setDate(type: string, event: MatDatepickerInputEvent<Moment>) {
    const date = event.value;
    switch (type) {
      case 'start':
        this.datesService.startChange.next(date);
        break;
      case 'end':
        this.datesService.endChange.next(date);
    }
  }

  filterStartDate(d: Moment): boolean {
    return this.datesService.filterStartDate(d);
  }

  filterEndDate(d: Moment): boolean {
    return this.datesService.filterEndDate(d);
  }
}
