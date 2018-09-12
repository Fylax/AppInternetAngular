import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {PurchaseService} from '../../services/purchase.service';
import {catchError, finalize} from 'rxjs/operators';
import {ArchivesPaginationSupport} from '../../model/archives-pagination-support';
import {Archive} from '../../model/archive';

export class PurchaseDataSource implements DataSource<Archive> {

  private purchasesSubject = new BehaviorSubject<Archive[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private total = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private purchaseService: PurchaseService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Archive[]> {
    return this.purchasesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.loadingSubject.complete();
    this.purchasesSubject.complete();
  }

  loadPurchases(pageIndex = 1, pageSize = 3, userId?: string) {
    this.loadingSubject.next(true);

    this.purchaseService.getPurchasedArchives(pageIndex, pageSize, userId)
        .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((response: ArchivesPaginationSupport) => {
          this.purchasesSubject.next(response.items); // these properties exist
          this.total.next(response.totalElements);
        });
  }

  get resultLength(): BehaviorSubject<number> {
    return this.total;
  }
}
