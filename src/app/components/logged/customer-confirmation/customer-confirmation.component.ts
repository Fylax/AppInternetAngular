import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShareMapInfoService} from '../../../services/share-map-info.service';
import {Location} from '@angular/common';
import {PositionsService} from '../../../services/positions.service';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {SpinnerService} from "../../../services/spinner.service";
import {DatesService} from "../../../services/dates.service";
import {first} from "rxjs/operators";
import {PurchaseService} from '../../../services/purchase.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customer-purchase',
  templateUrl: './customer-confirmation.component.html',
  styleUrls: ['./customer-confirmation.component.css']
})
export class CustomerConfirmationComponent implements OnInit, OnDestroy {

  leafletDirective: LeafletDirectiveWrapper;
  count: number;

  constructor(private shareInfoService: ShareMapInfoService,
              private positionsService: PositionsService,
              private spinnerService: SpinnerService,
              private purchaseService: PurchaseService,
              private location: Location,
              private router: Router,
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
    this.positionsService.getPositionCount(this.shareInfoService.userSearchRequest)
        .pipe(first()).subscribe(count => {
      this.count = count;
      this.shareInfoService.polygon.bindTooltip(count.toString(), {
        className: 'count-tooltip',
        permanent: true,
        direction: 'center',
        interactive: false
      }).openTooltip().addTo(this.leafletDirective.getMap());
      this.spinnerService.hideSpinner();
    });
  }

  buyPositions(): void {
    this.spinnerService.showSpinner();
    this.purchaseService.buyPositions(this.shareInfoService.userSearchRequest)
        .subscribe(
            x => {
              this.spinnerService.hideSpinner();
              this.router.navigate(['purchases']);
            }
        );
  }

  ngOnDestroy() {
    this.shareInfoService.polygon.closeTooltip();
    this.spinnerService.hideSpinner();
  }
}
