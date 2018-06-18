import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {PurchaseService} from '../../../../services/purchase.service';
import {PurchaseDataSource} from './PurchaseDataSource';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-customer-purchase',
  templateUrl: './customer-purchase.component.html',
  styleUrls: ['./customer-purchase.component.css']
})
export class CustomerPurchaseComponent implements OnInit, AfterViewInit, OnDestroy{
  displayedColumns = ['date', 'status', 'amount', 'count', 'start', 'end', 'details'];
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
    this.paginator.page
        .pipe(
            tap(() => this.loadPurchasesPage())
        )
        .subscribe();
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
}
