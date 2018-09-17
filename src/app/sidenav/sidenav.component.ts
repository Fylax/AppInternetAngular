import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {UrlService} from "../services/url.service";


@Component({
  selector: 'logged',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  readonly username: string;

  constructor(private user: UserService, private url: UrlService) {
    this.username = user.username;
  }

  logout() {
    this.user.logout();
    this.url.refresh();
  }

}
