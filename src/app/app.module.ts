import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatCardModule, MatGridListModule } from '@angular/material';
import { NotificationListPage } from './pages/notification-list/notification-list.page';
import { DetailsSettingsPage } from './pages/details-settings/details-settings.page';
import { Data } from './providers/data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NotificationListPageModule } from './pages/notification-list/notification-list.module';

import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpClientModule } from '@angular/common/http';
 
import { IonicStorageModule } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthGuardService } from './providers/auth-guard.service';
import { AngularMaterialPageModule } from './pages/angular-material/angular-material.module';
import { CauseGroupListPage } from './pages/cause-group-list/cause-group-list.page';
import { CauseCodeListPage } from './pages/cause-code-list/cause-code-list.page';

@NgModule({
  declarations: [AppComponent,DetailsSettingsPage,CauseGroupListPage,CauseCodeListPage],
  entryComponents: [NotificationListPage,DetailsSettingsPage,CauseGroupListPage,CauseCodeListPage],
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
    NotificationListPageModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularMaterialPageModule
  ],
  providers: [
    StatusBar,
    AuthGuardService,
    SplashScreen,
    Data,
    Camera,
    File,
    WebView,
    FilePath,
    NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
   // { provide: QRScanner, useClass: QRScannerMock }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
