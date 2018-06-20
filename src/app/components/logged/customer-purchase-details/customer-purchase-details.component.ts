import {Component, OnDestroy, OnInit} from '@angular/core';
import {PurchaseService} from '../../../services/purchase.service';
import {Purchase} from '../../../model/Purchase';
import {first} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {DatesService} from '../../../services/dates.service';
import * as L from 'leaflet';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {ShareMapInfoService} from '../../../services/share-map-info.service';
import {point} from 'leaflet';


const iconUrl = 'assets/my-icon.png';
const myIcon = L.icon({
  iconUrl: iconUrl,
  iconSize: [60, 65] // size of the icon
});
L.Marker.prototype.options.icon = myIcon;


@Component({
  selector: 'app-customer-purchase-details',
  templateUrl: './customer-purchase-details.component.html',
  styleUrls: ['./customer-purchase-details.component.css']
})
export class CustomerPurchaseDetailsComponent implements OnInit {
  displayedColumns = ['date', 'status', 'amount', 'count', 'start', 'end'];
  purchaseDetails: Purchase[];

  customerId: string;

  editableLayers = new L.FeatureGroup();

  //leafletDirective: LeafletDirectiveWrapper;

  constructor(private shareInfoService: ShareMapInfoService,
              private purchaseService: PurchaseService,
              private route: ActivatedRoute,
              // leafletDirective: LeafletDirective,
              datesService: DatesService) {
    datesService.hideDates();
    // this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    this.route.queryParams.pipe(first()).subscribe((param) => {
      this.customerId = param.customer;
    });
  }

  ngOnInit() {
    // this.leafletDirective.init();
    // this.leafletDirective.getMap().addLayer(this.editableLayers);

    const id = this.route.snapshot.paramMap.get('pid');

    this.purchaseService.getPurchaseDetails(id, this.customerId).subscribe(p => {
      p.countPosition = p.positions.length;
      this.purchaseDetails = [p];
      /*while (p.positions.length > 0) {
        const pos = p.positions.pop();
        const d = new Date(pos.timestamp * 1000);
        const points = pos.position.coordinates;
        L.marker(L.latLng([points[0], points[1]]), {
              icon: myIcon
            }
        )
            .bindPopup(d.toUTCString())
            .addTo(this.leafletDirective.getMap());

      }*/

    });
  }

}


