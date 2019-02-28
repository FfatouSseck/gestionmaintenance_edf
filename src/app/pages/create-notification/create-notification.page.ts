import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { BasePage } from '../base.page';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.page.html',
  styleUrls: ['./create-notification.page.scss'],
})
export class CreateNotificationPage extends BasePage implements OnInit{


  constructor(public _formBuilder: FormBuilder, public platform: Platform,
              public qrScanner: QRScanner, public toastController: ToastController,
              public snackBar: MatSnackBar,public alertController: AlertController) {
    
    super(_formBuilder,platform,qrScanner,toastController,snackBar,alertController);
  }

  ngOnInit() {
    this.notifFormGroup = this._formBuilder.group({
      description: ['', Validators.required],
      functloc: ['', Validators.required],
      equipment: [''],
      productionEff: [''],
      priority: [''],
      startDate: ['', Validators.required],
      damageCode: [''],
      cause: [''],
      objectPart: [''],
      longText: [''],
      breakdownIndic: ['']
    });
  }


}


