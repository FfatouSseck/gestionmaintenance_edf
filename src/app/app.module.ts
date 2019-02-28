import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { NotificationDetailsPage } from './pages/notification-details/notification-details.page';
import { NotificationListPage } from './pages/notification-list/notification-list.page';
import { DetailsSettingsPage } from './pages/details-settings/details-settings.page';
import { Data } from './providers/data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NotificationListPageModule } from './pages/notification-list/notification-list.module';

@NgModule({
  declarations: [AppComponent,NotificationDetailsPage,DetailsSettingsPage],
  entryComponents: [NotificationDetailsPage,NotificationListPage,DetailsSettingsPage],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    BrowserAnimationsModule, 
    MatButtonModule, 
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NotificationListPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Data,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
