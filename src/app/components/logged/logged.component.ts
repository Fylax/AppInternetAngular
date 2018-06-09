import {Component} from '@angular/core';
import {UserService, UserTokenService} from "../../services/user.service";


@Component({
  selector: 'logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css'],
  providers: [{provide: UserService, useExisting: UserTokenService}]
})
export class LoggedComponent {

}
