import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ServiceOrderPage } from './service-order.page';
import { GeneralModule } from 'src/app/components/general.module';
import { AngularMaterialPageModule } from '../angular-material/angular-material.module';

const routes: Routes = [
  {
    path: '',
    component: ServiceOrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    GeneralModule,
    AngularMaterialPageModule
  ],
  declarations: []
})
export class ServiceOrderPageModule {}
