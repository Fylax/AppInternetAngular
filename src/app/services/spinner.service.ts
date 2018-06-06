import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

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

  get spinnerStatus(): Observable<boolean> {
    return this.events.asObservable();
  }
}
