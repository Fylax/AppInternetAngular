import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatesService} from './dates.service';
import * as moment from 'moment';

@Component({
  selector: 'dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.css']
})
export class DatesComponent implements OnInit{

  @Output() dateChange: EventEmitter<{ start: Date, end: Date }> = this.service.dateChange;
  @Output() valid: EventEmitter<boolean> = this.service.valid;

  @Input() startDate: Date;
  @Input() endDate: Date;

  constructor(public service: DatesService) {
  }

  ngOnInit(): void {
    this.service.form.get('start.date').setValue(this.startDate);
    this.service.start = moment(this.startDate);
    this.service.form.get('start.hours').setValue(this.startDate.getHours());
    this.service.end = moment(this.endDate);
    this.service.form.get('start.minutes').setValue(this.startDate.getMinutes());
    this.service.form.get('end.date').setValue(this.endDate);
    this.service.form.get('end.hours').setValue(this.endDate.getHours());
    this.service.form.get('end.minutes').setValue(this.endDate.getMinutes());
  }
}
