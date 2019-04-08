import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StandardTextListPage } from './standard-text-list.page';

const routes: Routes = [
  {
    path: '',
    component: StandardTextListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StandardTextListPage]
})
export class StandardTextListPageModule {}
