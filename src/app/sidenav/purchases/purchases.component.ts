import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {PurchaseService} from '../../services/purchase.service';
import {PurchaseDataSource} from './purchase-data-source';
import {Subscription} from 'rxjs';
import {saveAs} from 'file-saver';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The header of mat-table
   */
  displayedColumns = ['archiveId', 'timestamp', 'amount', 'download'];

  dataSource: PurchaseDataSource;

  /**
   *Subscribe to the total elements
   */
  private subscription: Subscription;
  resultsLength;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private purchaseService: PurchaseService) {
  }

  ngOnInit() {
    this.dataSource = new PurchaseDataSource(this.purchaseService);
    this.subscription = this.dataSource.resultLength
        .subscribe(totals => this.resultsLength = totals);
    this.resultsLength = -1;
    this.dataSource.loadPurchases(1, 7);
  }

  /**
   * if purchased archives are less the ten the paginator is hidden
   */
  displayPaginator() {
    if (this.resultsLength > 6) {
      return 'block';
    } else {
      return 'none';
    }
  }

  /**
   * The paginator expose a page Observable that emits a new value each time the user clicks on the paginator navigation button
   * So subscribe to this observable in order to load new pages in response to a pagination event
   */
  ngAfterViewInit(): void {
    this.paginator.page
        .pipe(
            tap(() => this.loadPurchasePage())
        )
        .subscribe();
  }

  /**
   * Load purhcased archive calling method in datasource class
   */
  loadPurchasePage() {
    this.dataSource.loadPurchases(
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
  }

  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
    this.subscription.unsubscribe();
  }

  /**
   * Method called when user clicks on the download button. The response is saved as Blob with name ArchiveId
   * @param archiveId
   */
  downloadArchive(archiveId: string) {
    this.purchaseService.downloadPurchasedArchive(archiveId).subscribe(data => {
      data = JSON.stringify(data.positionList, undefined, 2);
      const blob = new Blob([data], {type: 'application/json'});
      saveAs(blob, archiveId);
    });
  }
}
