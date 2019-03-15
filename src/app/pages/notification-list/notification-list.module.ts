import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationListPage } from './notification-list.page';
import { AngularMaterialPageModule } from '../angular-material/angular-material.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { GeneralModule } from 'src/app/components/general.module';

const routes: Routes = [
  {
    path: '',
    component: NotificationListPage
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
    NotificationListPage
  ],
  entryComponents: [
  ]
})
export class NotificationListPageModule {}
