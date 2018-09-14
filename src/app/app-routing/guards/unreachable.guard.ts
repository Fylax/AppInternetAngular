import {Injectable} from "@angular/core";
import {CanActivate, Route, Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UnreachableGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.router.navigate(['search']);
    return true;
  }
}
