import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material';
import {DatesService} from './dates.service';
import {Moment} from 'moment';

@Component({
  selector: 'dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.css']
})
export class DatesComponent {

  start = this.datesService.form.get('start');
  end = this.datesService.form.get('end');

  @Output() dateChange: EventEmitter<{ start: Date, end: Date }> = this.datesService.dateChange;
  @Output() valid: EventEmitter<boolean> = this.datesService.valid;

  @Input() startDate: Date;
  @Input() endDate: Date;

  constructor(private datesService: DatesService) {
  }
  filterStartDate = (d: Moment): boolean => {
    return this.datesService.filterStartDate(d);
  }
  filterEndDate = (d: Moment): boolean => {
    return this.datesService.filterEndDate(d);
  }

  setDate(type: string, event: MatDatepickerInputEvent<Moment>) {
    const d = event.value;
    switch (type) {
      case 'start':
        this.datesService.start = d;
        break;
      case 'end':
        this.datesService.end = d;
    }
  }
}
