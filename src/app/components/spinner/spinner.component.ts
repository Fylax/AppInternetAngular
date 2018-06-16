import {Component, OnDestroy} from "@angular/core";
import {SpinnerService} from "../../services/spinner.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnDestroy {

  visible = false;
  private subscription_: Subscription

  constructor(spinnerService: SpinnerService) {
    this.subscription_ = spinnerService.spinnerStatus.subscribe(event => {
      this.visible = event;
    });
  }

  ngOnDestroy(): void {
    this.subscription_.unsubscribe();
  }
}
