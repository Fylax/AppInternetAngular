import {EventEmitter, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Moment} from "moment";

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  private hideEvents = new BehaviorSubject<boolean>(false);

  private form_ = new FormGroup({
    sdate: new FormControl(),
    edate: new FormControl()
  });
  private readonly _start_: Date;
  private readonly _end_: Date;

  private dateChange_ = new EventEmitter<{ start: Date, end: Date }>();
  private valid_ = new EventEmitter<boolean>();

  constructor() {
    this._start_ = new Date();
    this._start_.setDate(this._start_.getDate() - 2);
    this._end_ = new Date();
    this.form_.addControl('shour', new FormControl('', {
          updateOn: 'blur'
        })
    );
    this.form_.addControl('sminutes', new FormControl('', {
          updateOn: 'blur'
        })
    );
    this.form_.addControl('ehour', new FormControl('', {
          updateOn: 'blur'
        })
    );
    this.form_.addControl('eminutes', new FormControl('', {
          updateOn: 'blur'
        })
    );

    this.form_.get('shour').setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(23),
      this.startHourValidator()
    ]);
    this.form_.get('sminutes').setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(59),
      this.startMinuteValidator()
    ]);
    this.form_.get('ehour').setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(23),
      this.endHourValidator()
    ]);
    this.form_.get('eminutes').setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(59),
      this.endMinuteValidator()
    ]);

    this.form_.statusChanges.subscribe((val: string) => {
      const valid = val === 'VALID';
      this.valid_.emit(valid);
      if (valid) {
        this.dateChange_.emit({start: this._start_, end: this._end_});
      }
    });
    this.form_.get('shour').valueChanges.subscribe((val: string) => {
      this._start_.setHours(parseInt(val, 10));
    });
    this.form_.get('ehour').valueChanges.subscribe((val: string) => {
      this._end_.setHours(parseInt(val, 10));
    });
    this.form_.get('sminutes').valueChanges.subscribe((val: string) => {
      this._start_.setMinutes(parseInt(val, 10));
    });
    this.form_.get('eminutes').valueChanges.subscribe((val: string) => {
      this._end_.setMinutes(parseInt(val, 10));
    });
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

  public filterStartDate(d: Moment): boolean {
    return d.toDate() <= this._end_;
  }

  public filterEndDate(d: Moment): boolean {
    const newDate = new Date(this._start_);
    newDate.setDate(this._start_.getDate() - 1);
    return d.toDate() >= newDate && d.toDate() <= new Date();
  }

  private startHourValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(control.value, 10);
      const ehour = parseInt(this.form.get('ehour').value, 10);
      const valid = this._start_.getDate() === this._end_.getDate() && shour <= ehour;
      return valid ? null : {'startend': {value: control.value}};
    };
  }

  private endHourValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('shour').value, 10);
      const ehour = parseInt(control.value, 10);
      const valid = this._start_.getDate() === this._end_.getDate() && shour <= ehour;
      return valid ? null : {'startend': {value: control.value}};
    };
  }

  private startMinuteValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('shour').value, 10);
      const ehour = parseInt(this.form.get('ehour').value, 10);
      const sminutes = parseInt(control.value, 10);
      const eminutes = parseInt(this.form.get('eminutes').value, 10);
      const valid = this._start_.getDate() === this._end_.getDate() && shour === ehour && sminutes <= eminutes;
      return valid ? null : {'startend': {value: control.value}};
    };
  }

  private endMinuteValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('shour').value, 10);
      const ehour = parseInt(this.form.get('ehour').value, 10);
      const sminutes = parseInt(this.form.get('sminutes').value, 10);
      const eminutes = parseInt(control.value, 10);
      const valid = this._start_.getDate() === this._end_.getDate() && shour === ehour && sminutes <= eminutes;
      return valid ? null : {'startend': {value: control.value}};
    };
  }


  set start_(value: Moment) {
    this._start_.setFullYear(value.year(), value.month(), value.date());
  }

  set end_(value: Moment) {
    this._end_.setFullYear(value.year(), value.month(), value.date());
  }

  showDates() {
    this.hideEvents.next(false);
  }

  hideDates() {
    this.hideEvents.next(true);
  }

  get datesShowed(): BehaviorSubject<boolean> {
    return this.hideEvents;
  }
}
