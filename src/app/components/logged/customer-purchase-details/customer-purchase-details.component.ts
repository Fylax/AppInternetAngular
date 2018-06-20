import {Component, OnDestroy, OnInit} from '@angular/core';
import {PurchaseService} from '../../../services/purchase.service';
import {Purchase} from '../../../model/Purchase';
import {first} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {DatesService} from '../../../services/dates.service';

@Component({
  selector: 'app-customer-purchase-details',
  templateUrl: './customer-purchase-details.component.html',
  styleUrls: ['./customer-purchase-details.component.css']
})
export class CustomerPurchaseDetailsComponent implements OnInit {
  displayedColumns = ['date', 'status', 'amount', 'count', 'start', 'end'];
  purchaseDetails: Purchase[];

  customerId: string;

  constructor(private purchaseService: PurchaseService, private route: ActivatedRoute,
              datesService: DatesService) {
    datesService.hideDates();
    this.route.queryParams.pipe(first()).subscribe((param) => {
      this.customerId = param.customer;
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.purchaseService.getPurchaseDetails(id).subscribe(p => {
      p.countPosition = p.positions.length;
      this.purchaseDetails = [p];
    });
  }

}


