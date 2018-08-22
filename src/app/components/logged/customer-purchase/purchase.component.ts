import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {PurchaseService} from '../../../services/purchase.service';
import {PurchaseDataSource} from './PurchaseDataSource';
import {first, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'status', 'amount', 'count', 'start', 'end', 'details'];
  dataSource: PurchaseDataSource;

  private subscription: Subscription;
  resultsLength = 0;

  customerId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private purchaseService: PurchaseService,
              route: ActivatedRoute) {
    route.queryParams.pipe(first()).subscribe((param) => {
      this.customerId = param.customer;
    });
  }

  ngOnInit() {
    this.dataSource = new PurchaseDataSource(this.purchaseService);
    this.subscription = this.dataSource.resultLength
        .subscribe(totals => this.resultsLength = totals);
    this.dataSource.loadPurchases(1, 3, this.customerId);
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
        this.paginator.pageSize,
        this.customerId);
  }

  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
    this.subscription.unsubscribe();
  }
}
