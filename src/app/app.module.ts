import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatCardModule, MatGridListModule } from '@angular/material';
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
import { FunctLocListPage } from './pages/funct-loc-list/funct-loc-list.page';
import { EquipmentListPage } from './pages/equipment-list/equipment-list.page';
import { ObjectPartGroupListPage } from './pages/object-part-group-list/object-part-group-list.page';
import { ObjectPartCodeListPage } from './pages/object-part-code-list/object-part-code-list.page';
import { DamageCodePage } from './pages/damage-code/damage-code.page';
import { DamageGroupPage } from './pages/damage-group/damage-group.page';
import { Globalization } from '@ionic-native/globalization/ngx';
import { ChecklistPage } from './pages/checklist/checklist.page';
import { OperationDetailsPage } from './pages/operation-details/operation-details.page';
import { StandardTextListPage } from './pages/standard-text-list/standard-text-list.page';
import { WorkCenterListPage } from './pages/work-center-list/work-center-list.page';

@NgModule({
  declarations: [
    AppComponent,
    DetailsSettingsPage,
    CauseGroupListPage,
    CauseCodeListPage,
    FunctLocListPage,
    EquipmentListPage,
    ObjectPartCodeListPage,
    ObjectPartGroupListPage,
    DamageCodePage,
    DamageGroupPage,
    ChecklistPage,
    OperationDetailsPage,
    StandardTextListPage,
    WorkCenterListPage
  ],
  entryComponents: [
    NotificationListPage,
    DetailsSettingsPage,
    CauseGroupListPage,
    CauseCodeListPage,
    FunctLocListPage,
    EquipmentListPage,
    ObjectPartCodeListPage,
    ObjectPartGroupListPage,
    DamageCodePage,
    DamageGroupPage,
    ChecklistPage,
    OperationDetailsPage,
    StandardTextListPage,
    WorkCenterListPage
  ],
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
    Globalization
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
