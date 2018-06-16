import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class UnreachableGuard implements CanActivate {

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return next.routeConfig.path !== state.url.substr(state.url.lastIndexOf('/') + 1);
  }
}
