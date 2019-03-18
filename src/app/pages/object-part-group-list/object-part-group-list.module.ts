import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ObjectPartGroupListPage } from './object-part-group-list.page';

const routes: Routes = [
  {
    path: '',
    component: ObjectPartGroupListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ObjectPartGroupListPage]
})
export class ObjectPartGroupListPageModule {}
