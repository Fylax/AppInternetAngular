import {catchError, finalize} from 'rxjs/operators';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AdminService} from '../../../services/admin.service';
import {Link} from '../../../model/Link';
import {AdminPaginatorSupport} from '../../../model/AdminPaginatorSupport';

export class CustomerDataSource implements DataSource<Link> {

  private customersSubject = new BehaviorSubject<Link[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private total = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private adminService: AdminService) {}

  connect(collectionViewer: CollectionViewer): Observable<Link[]> {
    return this.customersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.loadingSubject.complete();
    this.customersSubject.complete();
  }

  loadCustomer(pageIndex = 1, pageSize = 3) {
    this.loadingSubject.next(true);

    this.adminService.getCustomers(pageIndex, pageSize)
        .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((response: AdminPaginatorSupport) => {
          this.customersSubject.next(response.items); // these properties exist
          this.total.next(response.totalElements);
        });
  }

  get resultLength(): BehaviorSubject<number> {
    return this.total;
  }
}
