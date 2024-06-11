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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SideBarComponent } from './side-bar/side-bar.component';
import { DataTablesModule } from 'angular-datatables';
import { RouterModule } from '@angular/router';
@NgModule({
    declarations: [AppComponent, NavbarComponent, FooterComponent, HomeComponent, SideBarComponent,],
    imports: [BrowserModule, AppRoutingModule, SharedModule, FontAwesomeModule, DataTablesModule],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, // for using the interceptor
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
