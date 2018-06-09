import {Component} from '@angular/core';
import {UserService, UserTokenService} from "./services/user.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{provide: UserService, useExisting: UserTokenService}]
})
export class AppComponent {
}
