import {EventEmitter, Injectable} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Moment} from 'moment';

@Injectable()
export class DatesService {

  /**
   * See getter.
   */
  private readonly form_ = new FormGroup({
    start: new FormGroup({
      date: new FormControl({disabled: false}, {updateOn: 'change'}),
      hours: new FormControl('', {updateOn: 'blur'}),
      minutes: new FormControl('', {updateOn: 'blur'})
    }),
    end: new FormGroup({
      date: new FormControl({disabled: false}, {updateOn: 'change'}),
      hours: new FormControl('', {updateOn: 'blur'}),
      minutes: new FormControl('', {updateOn: 'blur'})
    })
  });
  /**
   * Start capture date.
   */
  private readonly start_: Date;
  /**
   * End capture date.
   */
  private readonly end_: Date;
  /**
   * See getter.
   */
  private readonly startChange_ = new EventEmitter<Date>();
  /**
   * See getter.
   */
  private readonly endChange_ = new EventEmitter<Date>();
  /**
   * See getter.
   */
  private readonly valid_ = new EventEmitter<boolean>();

  constructor() {
    // Set start and and date to two dummy values to avoid null references.
    this.start_ = new Date(0);
    this.end_ = new Date();
    // Sets validator. Not set in constructor due to circular dependencies.
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
    // Subscribe to form changes to emit outputs
    this.form_.statusChanges.subscribe((val: string) => {
      this.valid_.emit(val === 'VALID');
    });
    this.form_.get('start').valueChanges.subscribe(() => {
      if (this.form_.valid) {
        this.startChange_.emit(this.start_);
      }
    });
    this.form_.get('end').valueChanges.subscribe(() => {
      if (this.form_.valid) {
        this.endChange_.emit(this.end_);
      }
    });
    // Subscribe to input changes to update dates
    this.form_.get('start.hours').valueChanges.subscribe((val: string) => {
      this.start_.setHours(parseInt(val, 10));
    });
    this.form_.get('end.hours').valueChanges.subscribe((val: string) => {
      this.end_.setHours(parseInt(val, 10));
    });
    this.form_.get('start.minutes').valueChanges.subscribe((val: string) => {
      this.start_.setMinutes(parseInt(val, 10));
    });
    this.form_.get('end.minutes').valueChanges.subscribe((val: string) => {
      this.end_.setMinutes(parseInt(val, 10));
    });
  }

  /**
   * Reactive form containing, in turn, start and end reactive forms.
   * It is in charge of validating all fields and preserve input state.
   */
  public get form(): FormGroup {
    return this.form_;
  }

  /**
   * Emitted when the form changes in a valid status.
   */
  public get valid(): EventEmitter<boolean> {
    return this.valid_;
  }

  /**
   * Emitted when start form content changes but still passes all validators.
   * This means that passing from `INVALID` to `VALID` or from `VALID` to `VALID`
   * emits the event. All other cases do not.
   */
  public get startChange(): EventEmitter<Date> {
    return this.startChange_;
  }

  /**
   * Emitted when end form content changes but still passes all validators.
   * This means that passing from `INVALID` to `VALID` or from `VALID` to `VALID`
   * emits the event. All other cases do not.
   */
  public get endChange(): EventEmitter<Date> {
    return this.endChange_;
  }

  /**
   * Sets start date value (date means only day, month and year).
   * @param value New date value.
   */
  set start(value: Moment) {
    this.start_.setFullYear(value.year(), value.month(), value.date());
  }

  /**
   * Sets end date value (date means only day, month and year).
   * @param value New date value.
   */
  set end(value: Moment) {
    this.end_.setFullYear(value.year(), value.month(), value.date());
  }

  /**
   * Filter used by the start ddatepicker to disable all dates in
   * after the selected end date, as choosing a beginning after
   * the end makes no sense.
   * @param d Date exposes by the datepicker.
   */
  public filterStartDate = (d: Moment): boolean => {
    if (this.form.get('start.hours').value > this.form.get('end.hours').value) {
      return d.toDate().getDate() < this.end_.getDate();
    }
    if (this.form.get('start.hours').value === this.form.get('end.hours').value &&
        this.form.get('start.minutes').value > this.form.get('end.minutes').value) {
      return d.toDate().getDate() < this.end_.getDate();
    }
    return d.toDate().getDate() <= this.end_.getDate();
  }

  /**
   * Filter used by the end datepicker to disable all dates in the
   * future and prior to the start date, as both cases makes
   * no sense.
   * @param d Date exposes by the datepicker.
   */
  public filterEndDate = (d: Moment): boolean => {
    if (this.form.get('end.hours').value < this.form.get('start.hours').value) {
      return d.toDate().getDate() > this.start_.getDate() && d.toDate() <= new Date();
    }
    if (this.form.get('end.hours').value === this.form.get('start.hours').value &&
        this.form.get('end.minutes').value < this.form.get('start.minutes').value) {
      return d.toDate().getDate() > this.start_.getDate() && d.toDate() <= new Date();
    }
    return d.toDate().getDate() >= this.start_.getDate() && d.toDate() <= new Date();
  };

  /**
   * Validator for the start hour. It gives an error if the same day for
   * start and end is selected and start hour is greater then the ending one.
   */
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

  /**
   * Validator for the end hour. It gives an error if the same day for
   * start and end is selected and start hour is greater then the ending one.
   */
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

  /**
   * Validator for the start minutes. It gives an error if the same day and
   * the same hour for start and end is selected but start minute is greater
   * then the ending one.
   */
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

  /**
   * Validator for the start minutes. It gives an error if the same day and
   * the same hour for start and end is selected but start minute is greater
   * then the ending one.
   */
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
