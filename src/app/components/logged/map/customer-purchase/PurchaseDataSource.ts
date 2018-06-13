import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {Purchase} from '../../../../model/Purchase';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {PurchaseService} from '../../../../services/purchase.service';
import {catchError, finalize} from 'rxjs/operators';

export class PurchaseDataSource implements DataSource<Purchase> {

  private purchasesSubject = new BehaviorSubject<Purchase[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private purchaseService: PurchaseService) {}

  connect(collectionViewer: CollectionViewer): Observable<Purchase[]> {
    return this.purchasesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.loadingSubject.complete();
    this.purchasesSubject.complete();
  }

  loadPurchases() {
    this.loadingSubject.next(true);

    this.purchaseService.getPurchaseList()
        .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(purchases => this.purchasesSubject.next(purchases));
  }
}
