import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AngularMaterialPageModule } from '../pages/angular-material/angular-material.module';
import { GeneralModule } from '../components/general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularMaterialPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    GeneralModule
  ],
  declarations: [
    HomePage
  ],
  entryComponents: [
  ]
})
export class HomePageModule {}
