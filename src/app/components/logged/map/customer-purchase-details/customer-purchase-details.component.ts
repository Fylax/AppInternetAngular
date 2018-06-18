import {Component, OnDestroy, OnInit} from '@angular/core';
import {PurchaseService} from '../../../../services/purchase.service';
import {Purchase} from '../../../../model/Purchase';
import {first} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {DatesService} from '../../../../services/dates.service';

@Component({
  selector: 'app-customer-purchase-details',
  templateUrl: './customer-purchase-details.component.html',
  styleUrls: ['./customer-purchase-details.component.css']
})
export class CustomerPurchaseDetailsComponent implements OnInit {

  purchaseDetails: Purchase;

  constructor(private purchaseService: PurchaseService, private route: ActivatedRoute,
              datesService: DatesService) {
    datesService.hideDates();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.purchaseService.getPurchaseDetails(id).subscribe(p => {
      this.purchaseDetails = p;
      console.log(this.purchaseDetails);
    });
  }

}


