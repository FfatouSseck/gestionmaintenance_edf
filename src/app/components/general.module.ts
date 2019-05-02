import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { AngularMaterialPageModule } from '../pages/angular-material/angular-material.module';
import { NotificationDetailsPage } from '../pages/notification-details/notification-details.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    AngularMaterialPageModule
  ],
  declarations: [
      HeaderComponent,
      NotificationDetailsPage,
  ],
  exports:[
      HeaderComponent,
      NotificationDetailsPage,
  ]
})
export class GeneralModule {}
