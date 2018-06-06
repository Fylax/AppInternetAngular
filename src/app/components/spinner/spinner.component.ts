import {Component} from "@angular/core";
import {SpinnerService} from "../../services/spinner.service";

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  visible = false;

  constructor(spinnerService: SpinnerService) {
    spinnerService.spinnerStatus.subscribe(event => {
      this.visible = event;
    });
  }
}
