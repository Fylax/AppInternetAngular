import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SpinnerComponent} from "./components/spinner/spinner.component";
import {MapComponent} from "./components/logged/map/map.component";
import {DatesComponent} from "./components/logged/map/dates/dates.component";
import {CustomerComponent} from "./components/logged/map/customer/customer.component";
import {CustomerConfirmationComponent} from './components/logged/map/customer-confirmation/customer-confirmation.component';

import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DATE_LOCALE, MatExpansionModule, MatInputModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoginComponent} from "./components/login/login.component";
import {LoggedComponent} from "./components/logged/logged.component";
import {TokenInterceptor} from "./interceptors/token.interceptor";
import { CustomerPurchaseComponent } from './components/logged/map/customer-purchase/customer-purchase.component';
import {ErrorComponent} from './components/error/error.component';
import { UserComponent } from './components/logged/map/user/user.component';
import {InterCattor} from "./interceptors/cat.interceptor";
import { CustomerPurchaseDetailsComponent } from './components/logged/map/customer-purchase-details/customer-purchase-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoggedComponent,
    MapComponent,
    DatesComponent,
    CustomerComponent,
    CustomerConfirmationComponent,
    SpinnerComponent,
    ErrorComponent,
    CustomerPurchaseComponent,
    UserComponent,
    CustomerPurchaseDetailsComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'it-IT'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterCattor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
