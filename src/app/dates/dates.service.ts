import {EventEmitter, Injectable} from "@angular/core";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Moment} from "moment";

@Injectable()
export class DatesService {

  private form_ = new FormGroup({
    start: new FormGroup({
      date: new FormControl({disabled: true}, {updateOn: 'change'}),
      hours: new FormControl('', {updateOn: 'blur'}),
      minutes: new FormControl('', {updateOn: 'blur'})
    }),
    end: new FormGroup({
      date: new FormControl({disabled: true}, {updateOn: 'change'}),
      hours: new FormControl('', {updateOn: 'blur'}),
      minutes: new FormControl('', {updateOn: 'blur'})
    })
  });
  private readonly start_: Date;
  private readonly end_: Date;

  private dateChange_ = new EventEmitter<{ start: Date, end: Date }>();
  private valid_ = new EventEmitter<boolean>();

  public filterStartDate = (d: Moment): boolean => {
    return d.toDate() <= this.end_;
  }

  public get form(): FormGroup {
    return this.form_;
  }

  public get valid(): EventEmitter<boolean> {
    return this.valid_;
  }

  public get dateChange(): EventEmitter<{ start: Date, end: Date }> {
    return this.dateChange_;
  }

  set start(value: Moment) {
    this.start_.setFullYear(value.year(), value.month(), value.date());
  }

  set end(value: Moment) {
    this.end_.setFullYear(value.year(), value.month(), value.date());
  }
  public filterEndDate = (d: Moment): boolean => {
    const newDate = new Date(this.start_);
    newDate.setDate(this.start_.getDate() - 1);
    return d.toDate() >= newDate && d.toDate() <= new Date();
  }

  constructor() {
    this.start_ = new Date(0);
    this.end_ = new Date();
    this.form_.get('start.hours').setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(23),
      this.startHourValidator()
    ]);
    this.form_.get('start.minutes').setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(59),
      this.startMinuteValidator()
    ]);
    this.form_.get('end.hours').setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(23),
      this.endHourValidator()
    ]);
    this.form_.get('end.minutes').setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(59),
      this.endMinuteValidator()
    ]);

    this.form_.statusChanges.subscribe((val: string) => {
      const valid = val === 'VALID';
      this.valid_.emit(valid);
      if (valid) {
        this.dateChange_.emit({start: this.start_, end: this.end_});
      }
    });
    this.form_.get('start.hours').valueChanges.subscribe((val: string) => {
      this.start_.setHours(parseInt(val, 10));
    });
    this.form_.get('start.hours').valueChanges.subscribe((val: string) => {
      this.end_.setHours(parseInt(val, 10));
    });
    this.form_.get('start.minutes').valueChanges.subscribe((val: string) => {
      this.start_.setMinutes(parseInt(val, 10));
    });
    this.form_.get('start.minutes').valueChanges.subscribe((val: string) => {
      this.end_.setMinutes(parseInt(val, 10));
    });
  }

  private startHourValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(control.value, 10);
      const ehour = parseInt(this.form.get('end.hours').value, 10);
      const invalid = this.start_.getFullYear() === this.end_.getFullYear() &&
          this.start_.getMonth() === this.end_.getMonth() && this.start_.getDate() === this.end_.getDate()
          && shour > ehour;
      return invalid ? {'startend': {value: control.value}} : null;
    };
  }

  private endHourValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('start.hours').value, 10);
      const ehour = parseInt(control.value, 10);
      const invalid = this.start_.getFullYear() === this.end_.getFullYear() &&
          this.start_.getMonth() === this.end_.getMonth() && this.start_.getDate() === this.end_.getDate()
          && shour > ehour;
      return invalid ? {'startend': {value: control.value}} : null;
    };
  }

  private startMinuteValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('start.hours').value, 10);
      const ehour = parseInt(this.form.get('end.hours').value, 10);
      const sminutes = parseInt(control.value, 10);
      const eminutes = parseInt(this.form.get('end.minutes').value, 10);
      const invalid = this.start_.getFullYear() === this.end_.getFullYear() &&
          this.start_.getMonth() === this.end_.getMonth() && this.start_.getDate() === this.end_.getDate()
          && shour === ehour && sminutes > eminutes;
      return invalid ? {'startend': {value: control.value}} : null;
    };
  }

  private endMinuteValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('start.hours').value, 10);
      const ehour = parseInt(this.form.get('end.hours').value, 10);
      const sminutes = parseInt(this.form.get('start.minutes').value, 10);
      const eminutes = parseInt(control.value, 10);
      const invalid = this.start_.getFullYear() === this.end_.getFullYear() &&
          this.start_.getMonth() === this.end_.getMonth() && this.start_.getDate() === this.end_.getDate()
          && shour === ehour && sminutes > eminutes;
      return invalid ? {'startend': {value: control.value}} : null;
    };
  }
}
