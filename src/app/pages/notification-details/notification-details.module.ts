import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationDetailsPage } from './notification-details.page';
import { AngularMaterialPageModule } from '../angular-material/angular-material.module';
import { GeneralModule } from 'src/app/components/general.module';

const routes: Routes = [
  {
    path: '',
    component: NotificationDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AngularMaterialPageModule,
    GeneralModule
  ],
  declarations: []
})
export class NotificationDetailsPageModule {}
