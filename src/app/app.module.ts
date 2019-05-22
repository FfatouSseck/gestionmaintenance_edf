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
import { EmployeeListPage } from './pages/employee-list/employee-list.page';
import { ActTypeListPage } from './pages/act-type-list/act-type-list.page';
import { ChecklistDetailsPage } from './pages/checklist-details/checklist-details.page';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Network } from '@ionic-native/network/ngx';
import { TimeSheetsListPage } from './pages/time-sheets-list/time-sheets-list.page';
import { ComponentsListPage } from './pages/components-list/components-list.page';
import { ComponentDetailsPage } from './pages/component-details/component-details.page';

//create our cost var with the information about the format that we want
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

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
    WorkCenterListPage,
    EmployeeListPage,
    ActTypeListPage,
    ChecklistDetailsPage,
    TimeSheetsListPage,
    ComponentsListPage,
    ComponentDetailsPage,
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
    WorkCenterListPage,
    EmployeeListPage,
    ActTypeListPage,
    ChecklistDetailsPage,
    TimeSheetsListPage,
    ComponentsListPage,
    ComponentDetailsPage,
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
    AngularMaterialPageModule,
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
    Globalization,
    { provide: MAT_DATE_LOCALE, useValue: 'fr' }, //you can change useValue
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    Network
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
