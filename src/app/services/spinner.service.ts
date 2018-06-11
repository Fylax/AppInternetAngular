import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private events = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  showSpinner() {
    this.events.next(true);
  }

  hideSpinner() {
    this.events.next(false);
  }

  get spinnerStatus(): BehaviorSubject<boolean> {
    return this.events;
  }
}
