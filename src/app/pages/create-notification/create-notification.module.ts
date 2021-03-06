import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateNotificationPage } from './create-notification.page';
import { AngularMaterialPageModule } from '../angular-material/angular-material.module';
import { GeneralModule } from 'src/app/components/general.module';


const routes: Routes = [
  {
    path: '',
    component: CreateNotificationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AngularMaterialPageModule,
    GeneralModule
  ],
  declarations: [
    CreateNotificationPage,
  ],
  entryComponents: [
  ]
})
export class CreateNotificationPageModule {}
