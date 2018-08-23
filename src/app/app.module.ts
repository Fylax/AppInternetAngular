import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from "./app-routing/app-routing.module";

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './interceptors/token.interceptor';
import {InterCattor} from './interceptors/cat.interceptor';

import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";
import {ErrorModule} from "./error/error.module";
import {SidenavModule} from "./sidenav/sidenav.module";
import {FullScreenSpinnerModule} from "./full-screen-spinner/full-screen-spinner.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FullScreenSpinnerModule.forRoot(),
    LoginModule.forRoot(),
    RegisterModule.forRoot(),
    ErrorModule,
    SidenavModule,
    AppRoutingModule
  ],
  providers: [
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
