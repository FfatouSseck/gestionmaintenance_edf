import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsListPage } from './components-list.page';
import { AngularMaterialPageModule } from '../angular-material/angular-material.module';

const routes: Routes = [
  {
    path: '',
    component: ComponentsListPage
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
  declarations: [ComponentsListPage]
})
export class ComponentsListPageModule {}
