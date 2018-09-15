import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'logged',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  readonly username: string;

  constructor(user: UserService, private router: Router) {
    this.username = user.username;
  }

  logout() {
    UserService.logout();
    this.router.navigateByUrl('/login');
  }
}
