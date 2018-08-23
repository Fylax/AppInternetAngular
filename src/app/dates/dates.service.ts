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
  private readonly start_: Date;
  private readonly end_: Date;

  private startDateChange_ = new BehaviorSubject<Moment>(null);
  private endDateChange_ = new BehaviorSubject<Moment>(null);

  private dateChange_ = new EventEmitter<{ start: Date, end: Date }>();
  private valid_ = new EventEmitter<boolean>();

  constructor() {
    this.start_ = new Date();
    this.start_.setDate(this.start_.getDate() - 2);
    this.end_ = new Date();
    this.form_.addControl('shour', new FormControl('', {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.min(0),
            Validators.max(23),
            this.startHourValidator()
          ]
        })
    );
    this.form_.addControl('sminutes', new FormControl('', {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.min(0),
            Validators.max(59),
            this.startMinuteValidator()
          ]
        })
    );
    this.form_.addControl('ehour', new FormControl('', {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.min(0),
            Validators.max(23),
            this.endHourValidator()
          ]
        })
    );
    this.form_.addControl('eminutes', new FormControl('', {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.min(0),
            Validators.max(59),
            this.endMinuteValidator()
          ]
        })
    );

    this.form_.statusChanges.subscribe((val: string) => {
      const valid = val === 'VALID';
      this.valid_.emit(valid);
      if (valid) {
        this.dateChange_.emit({start: this.start_, end: this.end_});
      }
    });
    this.startDateChange_.subscribe((date: Moment) => {
      this.start_.setFullYear(date.year(), date.month(), date.date());
    });
    this.endDateChange_.subscribe((date: Moment) => {
      this.end_.setFullYear(date.year(), date.month(), date.date());
    });
    this.form_.get('shour').valueChanges.subscribe((val: string) => {
      this.start_.setHours(parseInt(val, 10));
    });
    this.form_.get('ehour').valueChanges.subscribe((val: string) => {
      this.end_.setHours(parseInt(val, 10));
    });
    this.form_.get('sminutes').valueChanges.subscribe((val: string) => {
      this.start_.setMinutes(parseInt(val, 10));
    });
    this.form_.get('eminutes').valueChanges.subscribe((val: string) => {
      this.end_.setMinutes(parseInt(val, 10));
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

  public get startChange(): BehaviorSubject<Moment> {
    return this.startDateChange_;
  }

  public get endChange(): BehaviorSubject<Moment> {
    return this.endDateChange_;
  }

  public filterStartDate(d: Moment): boolean {
    return d.toDate() <= this.end_;
  }

  public filterEndDate(d: Moment): boolean {
    const newDate = new Date(this.start_);
    newDate.setDate(this.start_.getDate() - 1);
    return d.toDate() >= newDate && d.toDate() <= new Date();
  }

  private startHourValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(control.value, 10);
      const ehour = parseInt(this.form.get('ehour').value, 10);
      const valid = this.start_.getDate() === this.end_.getDate() && shour <= ehour;
      return valid ? null : {'startend': {value: control.value}};
    };
  }

  private endHourValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('shour').value, 10);
      const ehour = parseInt(control.value, 10);
      const valid = this.start_.getDate() === this.end_.getDate() && shour <= ehour;
      return valid ? null : {'startend': {value: control.value}};
    };
  }

  private startMinuteValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('shour').value, 10);
      const ehour = parseInt(this.form.get('ehour').value, 10);
      const sminutes = parseInt(control.value, 10);
      const eminutes = parseInt(this.form.get('eminutes').value, 10);
      const valid = this.start_.getDate() === this.end_.getDate() && shour === ehour && sminutes <= eminutes;
      return valid ? null : {'startend': {value: control.value}};
    };
  }

  private endMinuteValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const shour = parseInt(this.form.get('shour').value, 10);
      const ehour = parseInt(this.form.get('ehour').value, 10);
      const sminutes = parseInt(this.form.get('sminutes').value, 10);
      const eminutes = parseInt(control.value, 10);
      const valid = this.start_.getDate() === this.end_.getDate() && shour === ehour && sminutes <= eminutes;
      return valid ? null : {'startend': {value: control.value}};
    };
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
