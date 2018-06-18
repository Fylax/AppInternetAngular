import {catchError, finalize} from 'rxjs/operators';
import {Purchase} from '../../../../model/Purchase';
import {PurchaseService} from '../../../../services/purchase.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AdminService} from '../../../../services/admin.service';
import {Link} from '../../../../model/Link';
import {AdminPaginatorSupport} from '../../../../model/AdminPaginatorSupport';

export class UserDataSource implements DataSource<Link> {

  private usersSubject = new BehaviorSubject<Link[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private total = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private adminService: AdminService) {}

  connect(collectionViewer: CollectionViewer): Observable<Link[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.loadingSubject.complete();
    this.usersSubject.complete();
  }

  loadUsers(pageIndex = 1, pageSize = 3) {
    this.loadingSubject.next(true);

    this.adminService.getUsers(pageIndex, pageSize)
        .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((response: AdminPaginatorSupport) => {
          this.usersSubject.next(response.items); // these properties exist
          this.total.next(response.totalElements);
        });
  }

  get resultLength(): BehaviorSubject<number> {
    return this.total;
  }
}
