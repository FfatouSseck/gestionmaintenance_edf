import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { Priority } from '../interfaces/priority.interface';
import { ProductionEffect } from '../interfaces/effect.interface';
import { CauseCode } from '../interfaces/causecode.interface';
import { CauseGroup } from '../interfaces/causegroup.interface';

//import { QRScannerMock } from '@ionic-native-mocks/qr-scanner';

@Component({
  selector: 'app-base',
  styleUrls: [],
})
export class BasePage implements OnInit{

  notifFormGroup: FormGroup;
  locations: Location[] = [];
  productionEffects: ProductionEffect[] = [];
  causeCodes: CauseCode[] = [];
  causeGroups: CauseGroup[] = [];
  priorities:Priority[] = []
  today = new Date();
  dateauj = "";
  mobile = false;

  constructor(public _formBuilder: FormBuilder, public platform: Platform,
              public qrScanner: QRScanner, public toastController: ToastController,
              public snackBar: MatSnackBar,public alertController: AlertController/*, public mockScanner: QRScannerMock*/) {
    
    this.initDate();
    if (platform.is("mobile")) this.mobile = true;
  }

  initDate(){
    let m = this.today.getMonth() + 1;
    let d = this.today.getDate();
    let min = this.today.getMinutes();
    let h = this.today.getHours();
    let minutes = "";
    let month = "";
    let hours = "";
    let day = "";

    if (m.toString().length < 2) {
      month = "0" + m;
    } else month = m.toString();

    if (min.toString().length < 2) {
      minutes = "0" + min;
    } else minutes = min.toString();

    if (h.toString().length < 2) {
      hours = "0" + h;
    } else hours = h.toString();

    if(d.toString().length < 2){
      day = "0"+d;
    }else day = d.toString();

    this.dateauj = day + "/" + month + "/" + this.today.getFullYear() + " " + hours + ":" + minutes;

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

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  scanQRCode() {
    //if we are on mobile device
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.openSnackBar("Operation not permitted!")

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          this.qrScanner.openSettings();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.

          this.openSnackBar("Operation not permitted!")
        }
      })
      .catch((e: any) => {
        this.presentQRAlert();
      });

      if(!this.mobile){
        console.log("Sur ordinateur")
      }
  }

  

  async presentQRAlert() {
    const alert = await this.alertController.create({
      header: 'BarCode',
      inputs: [
        {
          name: 'codeBarre',
          type: 'text',
          placeholder: 'Type barcode'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  reset(){
    this.notifFormGroup.controls.description.setValue("");
    this.notifFormGroup.controls.functloc.setValue("");
    this.notifFormGroup.controls.damageCode.setValue("");
    this.notifFormGroup.controls.equipment.setValue("");
    this.notifFormGroup.controls.productionEff.setValue("");
    this.notifFormGroup.controls.priority.setValue("");
    this.notifFormGroup.controls.objectPart.setValue("");
    this.notifFormGroup.controls.longText.setValue("");
    this.notifFormGroup.controls.cause.setValue("");
    this.notifFormGroup.controls.breakdownIndic.setValue("");
  }

  async presentRestConfirm() {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: '<strong>All data will be lost. Do you want to continue </strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.reset();
          }
        }
      ]
    });

    await alert.present();
  }


}

export interface Location {
  loc: string;
  description: string;
}

