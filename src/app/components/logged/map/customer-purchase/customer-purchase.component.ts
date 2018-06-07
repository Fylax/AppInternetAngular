import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShareMapInfoService} from '../../../../services/share-map-info.service';
import {Location} from '@angular/common';
import {PositionsService} from '../../../../services/positions.service';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {SpinnerService} from "../../../../services/spinner.service";
import {DatesService} from "../../../../services/dates.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-customer-purchase',
  templateUrl: './customer-purchase.component.html',
  styleUrls: ['./customer-purchase.component.css']
})
export class CustomerPurchaseComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  leafletDirective: LeafletDirectiveWrapper;
  count: number;

  constructor(private shareInfoService: ShareMapInfoService,
              private positionsService: PositionsService,
              private spinnerService: SpinnerService,
              private location: Location,
              datesService: DatesService,
              leafletDirective: LeafletDirective) {
    this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    this.spinnerService.showSpinner();
    datesService.disableDates();
  }

  cancel(): void {
    this.shareInfoService.polygon.closeTooltip();
    this.location.back();
  }

  ngOnInit() {
    this.subscription = this.positionsService.getPositionCount(this.shareInfoService.customerRequest)
        .subscribe(count => {
          this.count = count;
          this.shareInfoService.polygon.bindTooltip(count.toString(), {
            className: 'count-tooltip',
            permanent: true,
            direction: 'center',
            interactive: false
          }).openTooltip().addTo(this.leafletDirective.getMap());
          this.spinnerService.hideSpinner();
          this.subscription.unsubscribe();
        });
  }

  ngOnDestroy() {
    this.shareInfoService.polygon.closeTooltip();
    this.spinnerService.hideSpinner();
  }
}

