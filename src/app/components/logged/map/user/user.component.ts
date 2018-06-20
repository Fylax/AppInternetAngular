import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {LeafletDirective, LeafletDirectiveWrapper} from '@asymmetrik/ngx-leaflet';
import {PositionsService} from '../../../../services/positions.service';
import {ShareMapInfoService} from '../../../../services/share-map-info.service';
import {SpinnerService} from '../../../../services/spinner.service';
import {HttpClient} from '@angular/common/http';
import {catchError, first} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';


const iconUrl = 'assets/my-icon.png';
const myIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [60, 65] // size of the icon
});
L.Marker.prototype.options.icon = myIcon;


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {

    editableLayers = new L.FeatureGroup();
    leafletDirective: LeafletDirectiveWrapper;
    subscription: Subscription;

    userId: string;

    constructor(private shareInfoService: ShareMapInfoService,
                private positionsService: PositionsService,
                private http: HttpClient,
                private spinner: SpinnerService,
                leafletDirective: LeafletDirective,
                route: ActivatedRoute) {
        spinner.hideSpinner();
      route.queryParams.pipe(first()).subscribe((param) => {
        this.userId = param.user;
      });
        this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    }

    ngOnInit() {
        this.leafletDirective.init();
        this.leafletDirective.getMap().addLayer(this.editableLayers);

        // this.spinner.showSpinner();
        // this.positionsService.getPositions()
        //     .pipe(first())
        //     .subscribe(data => {
        //         this.positionsService.postPositions(JSON.stringify(data))
        //             .pipe(
        //                 first(),
        //                 catchError((error: Response) => {
        //                     if (error.status !== 201) {
        //                         this.spinner.hideSpinner();
        //                         console.log('Error: ' + error.status);
        //                         return throwError(error);
        //                     }
        //                 })
        //             ).subscribe(response => {
        //                 this.spinner.hideSpinner();
        //         });
        //     });
    }

    ngAfterViewInit() {
        this.subscription = this.shareInfoService.infoUserReady.subscribe(ready => {
            if (ready) {
                document.getElementById('confirmationUser-button').style.display = 'block';
            } else {
                document.getElementById('confirmationUser-button').style.display = 'none';
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    showPositions(): void {
        this.spinner.showSpinner();
        this.positionsService.getPositionsFromServer(this.shareInfoService.userRequest, this.userId)
            .pipe(first())
            .subscribe(
            result => {
                while (result.positionList.length > 0) {
                    const pos = result.positionList.pop();
                    const d = new Date(pos.timestamp * 1000);
                    L.marker(L.latLng([pos.latitude, pos.longitude]), {
                            icon: myIcon
                        }
                    )
                        .bindPopup(d.toUTCString())
                        .addTo(this.leafletDirective.getMap());

                }
                this.spinner.hideSpinner();
                document.getElementById('confirmationUser-button').style.display = 'none';
            }
        );
    }

}
