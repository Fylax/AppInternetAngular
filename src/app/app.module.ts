import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SpinnerComponent} from "./components/spinner/spinner.component";
import {MapComponent} from "./components/logged/map/map.component";
import {DatesComponent} from "./components/logged/map/dates/dates.component";
import {CustomerbuyComponent} from "./components/logged/map/customerbuy/customerbuy.component";
import {CustomerPurchaseComponent} from './components/logged/map/customer-purchase/customer-purchase.component';

import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DATE_LOCALE, MatExpansionModule, MatInputModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoginComponent} from "./components/login/login.component";
import {LoggedComponent} from "./components/logged/logged.component";
import {NotFoundComponent} from "./components/notfound/not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoggedComponent,
    MapComponent,
    DatesComponent,
    CustomerbuyComponent,
    CustomerPurchaseComponent,
    SpinnerComponent,
    NotFoundComponent
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
    MatProgressSpinnerModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'it-IT'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
