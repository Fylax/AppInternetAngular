import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {Purchase} from '../../../model/purchase';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {PurchaseService} from '../../../services/purchase.service';
import {catchError, finalize} from 'rxjs/operators';
import {PurchasesPaginationSupport} from '../../../model/purchases-pagination-support';

export class PurchaseDataSource implements DataSource<Purchase> {

  private purchasesSubject = new BehaviorSubject<Purchase[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private total = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private purchaseService: PurchaseService) {}

  connect(collectionViewer: CollectionViewer): Observable<Purchase[]> {
    return this.purchasesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.loadingSubject.complete();
    this.purchasesSubject.complete();
  }

  loadPurchases(pageIndex = 1, pageSize = 3, customerId?: string) {
    this.loadingSubject.next(true);

    this.purchaseService.getPurchaseList(pageIndex, pageSize, customerId)
        .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((response: PurchasesPaginationSupport) => {
            this.purchasesSubject.next(response.items); // these properties exist
            this.total.next(response.totalElements);
        });
  }

  get resultLength(): BehaviorSubject<number> {
    return this.total;
  }
}
