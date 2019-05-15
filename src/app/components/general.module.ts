import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { AngularMaterialPageModule } from '../pages/angular-material/angular-material.module';
import { NotificationDetailsPage } from '../pages/notification-details/notification-details.page';
import { ServiceOrderPage } from '../pages/service-order/service-order.page';
import { ServiceOrderComponent } from './service-order/service-order.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    AngularMaterialPageModule
  ],
  declarations: [
      HeaderComponent,
      NotificationDetailsPage,
      ServiceOrderPage,
      ServiceOrderComponent
  ],
  exports:[
      HeaderComponent,
      NotificationDetailsPage,
      ServiceOrderPage,
      ServiceOrderComponent
  ]
})
export class GeneralModule {}
