import {Component} from '@angular/core';
import {Role, UserService} from "../../services/user.service";

@Component({
  selector: 'logged',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  isAdmin: boolean;

  constructor(userService: UserService) {
    this.isAdmin = userService.hasRole(Role.ADMIN);
  }
}
