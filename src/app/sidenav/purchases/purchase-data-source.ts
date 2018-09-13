import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {PurchaseService} from '../../services/purchase.service';
import {catchError, finalize} from 'rxjs/operators';
import {ArchivesPaginationSupport} from '../../model/archives-pagination-support';
import {Archive} from '../../model/archive';

export class PurchaseDataSource implements DataSource<Archive> {

  /**
   * This subject is going to be emitting the values retrieved from the backend
   * It is a BehaviorSubject, which means its subscribers will always get its latest emitted value
   */
  private purchasesSubject = new BehaviorSubject<Archive[]>([]);
  /**
   * This subject is used to indicate if data is loading
   */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /**
   * This subject indicates how many elements are available on the backend
   */
  private total = new BehaviorSubject<number>(0);
  /**
   * The public observable used in template to check if data is loading
   */
  public loading$ = this.loadingSubject.asObservable();

  constructor(private purchaseService: PurchaseService) {
  }

  /**
   * This method is called at table bootstrap time and return an observable that emit a list of archives to fill the table
   * @param collectionViewer
   */
  connect(collectionViewer: CollectionViewer): Observable<Archive[]> {
    return this.purchasesSubject.asObservable();
  }

  /**
   * This method is called once at component destruction time and avoid memory leaks.
   * @param collectionViewer
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.loadingSubject.complete();
    this.purchasesSubject.complete();
  }

  /**
   * This method is called for retrieving data from backend to fill the table
   * In case of error return an empty list, otherwise call next() method on the purchaseSubject and so data are emitted
   * @param pageIndex: page number
   * @param pageSize: number of elements per page
   * @param userId: optional, used in case of admin request
   */
  loadPurchases(pageIndex = 1, pageSize = 3, userId?: string) {
    this.loadingSubject.next(true);

    this.purchaseService.getPurchasedArchives(pageIndex, pageSize, userId)
        .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((response: ArchivesPaginationSupport) => {
          this.purchasesSubject.next(response.items);
          this.total.next(response.totalElements);
        });
  }

  /**
   * This method return the subject indicating the total elements on backend
   */
  get resultLength(): BehaviorSubject<number> {
    return this.total;
  }
}
