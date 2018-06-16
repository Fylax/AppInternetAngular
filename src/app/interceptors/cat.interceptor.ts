import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
export class InterCattor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError((err: Error) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status >= 500) {
              this.router.navigate(['error', err.status]);
              return;
            }
          }
          return next.handle(req);
        }));
  }
}