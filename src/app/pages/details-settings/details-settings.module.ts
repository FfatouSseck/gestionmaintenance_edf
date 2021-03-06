import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailsSettingsPage } from './details-settings.page';
import { AngularMaterialPageModule } from '../angular-material/angular-material.module';
import { MatProgressSpinnerModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: DetailsSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AngularMaterialPageModule,
    MatProgressSpinnerModule,
  ],
  declarations: [DetailsSettingsPage]
})
export class DetailsSettingsPageModule {}
