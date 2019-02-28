import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    MatGridListModule
  ],
  declarations: [],
  exports:[
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    MatGridListModule
  ]
})
export class AngularMaterialPageModule {}
