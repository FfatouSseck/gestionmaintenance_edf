import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { SpeedDialFabComponent } from './speed-dial-fab/speed-dial-fab.component';
import { AngularMaterialPageModule } from '../pages/angular-material/angular-material.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    AngularMaterialPageModule
  ],
  declarations: [
      HeaderComponent,
      SpeedDialFabComponent
  ],
  exports:[
      HeaderComponent,
      SpeedDialFabComponent
  ]
})
export class GeneralModule {}
