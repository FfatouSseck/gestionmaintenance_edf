import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderTimeAndMaterialPage } from './order-time-and-material.page';

const routes: Routes = [
  {
    path: '',
    component: OrderTimeAndMaterialPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderTimeAndMaterialPage]
})
export class OrderTimeAndMaterialPageModule {}
