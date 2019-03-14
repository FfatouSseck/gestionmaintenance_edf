import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FunctLocListPage } from './funct-loc-list.page';

const routes: Routes = [
  {
    path: '',
    component: FunctLocListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FunctLocListPage]
})
export class FunctLocListPageModule {}
