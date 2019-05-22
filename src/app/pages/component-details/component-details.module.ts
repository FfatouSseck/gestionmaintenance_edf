import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentDetailsPage } from './component-details.page';
import { AngularMaterialPageModule } from '../angular-material/angular-material.module';

const routes: Routes = [
  {
    path: '',
    component: ComponentDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AngularMaterialPageModule
  ],
  declarations: [ComponentDetailsPage]
})
export class ComponentDetailsPageModule {}
