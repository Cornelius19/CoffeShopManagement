import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FontAwesomeModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true} // for using the interceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
