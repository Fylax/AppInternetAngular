import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class DatesService {
  private events = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  disableDates() {
    this.events.next(true);
  }

  enableDates() {
    this.events.next(false);
  }

  get datesStatus(): Observable<boolean> {
    return this.events.asObservable();
  }
}
