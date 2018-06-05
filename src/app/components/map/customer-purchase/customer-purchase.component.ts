import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShareMapInfoService} from '../../../services/share-map-info.service';
import {Location} from '@angular/common';
import {PositionsService} from '../../../services/positions.service';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-customer-purchase',
  templateUrl: './customer-purchase.component.html',
  styleUrls: ['./customer-purchase.component.css']
})
export class CustomerPurchaseComponent implements OnInit, OnDestroy {

  leafletDirective: LeafletDirectiveWrapper;
  count: number;

  constructor(private shareInfoService: ShareMapInfoService,
              private positionsService: PositionsService,
              private location: Location,
              leafletDirective: LeafletDirective) {
    this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
  }

  cancel(): void {
    this.shareInfoService.customerRequest.polygon.closeTooltip();
    this.location.back();
  }

  ngOnInit() {
    this.positionsService.getPositionCount(this.shareInfoService.customerRequest)
        .subscribe(count => {
          this.count = count;
          this.shareInfoService.customerRequest.polygon.bindTooltip(count.toString(), {
            className: 'count-tooltip',
            permanent: true,
            direction: 'center',
            interactive: false
          }).openTooltip().addTo(this.leafletDirective.getMap());
        });
  }

  ngOnDestroy() {
    // this.leafletDirective.getMap().removeLayer(this.shareInfoService.customerRequest.polygon);
    this.shareInfoService.customerRequest.polygon.closeTooltip();
  }
}

