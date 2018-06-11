import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {PurchaseService} from '../../../../services/purchase.service';
import {PurchaseDataSource} from './PurchaseDataSource';
import {Purchase} from '../../../../model/Purchase';

@Component({
  selector: 'app-customer-purchase',
  templateUrl: './customer-purchase.component.html',
  styleUrls: ['./customer-purchase.component.css']
})
export class CustomerPurchaseComponent implements OnInit {
  displayedColumns = ['date', 'status', 'amount', 'count', 'start', 'end', 'details'];
  dataSource: PurchaseDataSource;

  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.dataSource = new PurchaseDataSource(this.purchaseService);
    this.dataSource.loadPurchases();
  }

  showDetails(row: Purchase): void {
    console.log(row);
  }
}
