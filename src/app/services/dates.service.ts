import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

@Injectable({
  providedIn: 'root'
})
export class DatesService {
  private events = new BehaviorSubject<boolean>(false);
  private hideEvents = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  disableDates() {
    this.events.next(true);
  }

  enableDates() {
    this.events.next(false);
  }

  get datesStatus(): BehaviorSubject<boolean> {
    return this.events;
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
