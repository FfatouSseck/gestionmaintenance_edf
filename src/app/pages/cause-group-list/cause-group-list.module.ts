import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CauseGroupListPage } from './cause-group-list.page';

const routes: Routes = [
  {
    path: '',
    component: CauseGroupListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CauseGroupListPage]
})
export class CauseGroupListPageModule {}
