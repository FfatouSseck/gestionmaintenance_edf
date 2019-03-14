import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CauseCodeListPage } from './cause-code-list.page';

const routes: Routes = [
  {
    path: '',
    component: CauseCodeListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CauseCodeListPage]
})
export class CauseCodeListPageModule {}
