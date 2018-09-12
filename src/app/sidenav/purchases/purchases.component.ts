import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {PurchaseService} from '../../services/purchase.service';
import {PurchaseDataSource} from './purchase-data-source';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['archiveId', 'timestamp', 'amount', 'download'];
  dataSource: PurchaseDataSource;

  private subscription: Subscription;
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private purchaseService: PurchaseService) {
  }

  ngOnInit() {
    this.dataSource = new PurchaseDataSource(this.purchaseService);
    this.subscription = this.dataSource.resultLength
        .subscribe(totals => this.resultsLength = totals);
    this.dataSource.loadPurchases(1, 3);
  }

  ngAfterViewInit(): void {
    let index = 1;
    let size = 10;
    if (this.paginator !== undefined) {
      index = this.paginator.pageIndex + 1;
      size = this.paginator.pageSize;
    }
    this.dataSource.loadPurchases(
        index,
        size);
  }

  loadPurchasesPage() {
    this.dataSource.loadPurchases(
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
  }

  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
    this.subscription.unsubscribe();
  }

  downloadArchive(archiveId: string) {
    this.purchaseService.downloadPurchasedArchive(archiveId).subscribe(data => {
      data = JSON.stringify(data.positionList, undefined, 2);
      const blob = new Blob([data], {type: 'application/json'});
      saveAs(blob, archiveId);
    });
  }
}
