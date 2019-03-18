import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ObjectPartCodeListPage } from './object-part-code-list.page';

const routes: Routes = [
  {
    path: '',
    component: ObjectPartCodeListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ObjectPartCodeListPage]
})
export class ObjectPartCodeListPageModule {}
