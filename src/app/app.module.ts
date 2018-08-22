import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {MapComponent} from './components/logged/map/map.component';
import {DatesComponent} from './components/logged/dates/dates.component';
import {CustomerComponent} from './components/logged/customer/customer.component';

import {FlexLayoutModule} from '@angular/flex-layout';

import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatDividerModule} from '@angular/material/divider';
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
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SidenavComponent} from './components/logged/sidenav.component';
import {TokenInterceptor} from './interceptors/token.interceptor';
import {PurchaseComponent} from './components/logged/customer-purchase/purchase.component';
import {ErrorComponent} from './components/error/error.component';
import {UserComponent} from './components/logged/user/user.component';
import {InterCattor} from './interceptors/cat.interceptor';
import {PurchaseDetailsComponent} from './components/logged/customer-purchase-details/purchase-details.component';
import {AdminComponent} from './components/logged/admin/admin.component';
import {UserUploadComponent} from './components/logged/user-upload/user-upload.component';
import {FileUploadModule} from "ng2-file-upload";
import {UserArchiveComponent} from './components/logged/user-archive/user-archive.component';
import {SearchComponent} from './components/logged/search/search.component';

import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    MapComponent,
    DatesComponent,
    CustomerComponent,
    SpinnerComponent,
    ErrorComponent,
    PurchaseComponent,
    UserComponent,
    PurchaseDetailsComponent,
    AdminComponent,
    UserUploadComponent,
    SearchComponent,
    UserArchiveComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LoginModule.forRoot(),
    RegisterModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
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
    MatSortModule,
    MatListModule,
    MatTabsModule,
    MatProgressBarModule,
    FileUploadModule
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
