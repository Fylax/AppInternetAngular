import {Component, OnDestroy} from "@angular/core";
import {FullScreenSpinnerService} from "./full-screen-spinner.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'spinner',
  templateUrl: './full-screen-spinner.component.html',
  styleUrls: ['./full-screen-spinner.component.css']
})
export class FullScreenSpinnerComponent implements OnDestroy {

  visible = false;
  private subscription_: Subscription;

  constructor(spinnerService: FullScreenSpinnerService) {
    this.subscription_ = spinnerService.spinnerStatus.subscribe(event => {
      this.visible = event;
    });
  }

  ngOnDestroy(): void {
    this.subscription_.unsubscribe();
  }
}
