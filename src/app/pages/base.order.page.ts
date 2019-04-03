import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform, ToastController, AlertController, ModalController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { Priority } from '../interfaces/priority.interface';
import { ProductionEffect } from '../interfaces/effect.interface';
import { CauseCode } from '../interfaces/causecode.interface';
import { CauseGroup } from '../interfaces/causegroup.interface';
import { FunctlocService } from '../providers/functloc.service';
import { DetailsSettingsPage } from './details-settings/details-settings.page';
import { OperationDetailsPage } from './operation-details/operation-details.page';

//import { QRScannerMock } from '@ionic-native-mocks/qr-scanner';

@Component({
  selector: 'app-base',
  styleUrls: [],
})
export class BaseOrderPage implements OnInit {

  orderFormGroup: FormGroup;
  modal: any;
  locations: any[] = [];

  productionEffects: ProductionEffect[] = [];
  causeCodes: CauseCode[] = [];
  causeGroups: CauseGroup[] = [];
  priorities: Priority[] = []
  today = new Date();
  dateauj = "";
  mobile = false;

  constructor(public _formBuilder: FormBuilder, public platform: Platform,
    public toastController: ToastController, public snackBar: MatSnackBar,
    public alertController: AlertController, public modalController: ModalController) {

    this.initDate();
    if (platform.is("mobile")) this.mobile = true;
  }

  initDate() {
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

    if (d.toString().length < 2) {
      day = "0" + d;
    } else day = d.toString();

    this.dateauj = day + "/" + month + "/" + this.today.getFullYear() + " " + hours + ":" + minutes;

  }

  ngOnInit() {
    this.orderFormGroup = this._formBuilder.group({
      description: ['', Validators.required],
      pmActType: ['', Validators.required],
      assignee: [''],
      functloc: ['', Validators.required],
      priority: [''],
      equipmentNo: [''],
      status: [''],
      text: [''],

      //for the notification
      notifNo: [''],
      breakdownIndic: [''],
      damageCode: [''],
      cause: [''],
      causeDescr: [''],
      objectPart: ['']
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  //list available plants
  async presentPlantsModal() {
    this.modal = await this.modalController.create({
      component: DetailsSettingsPage,
      componentProps: {},
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    console.log(data.result);
  }

  //list operation details
  async presentOperationModal(operations) {
    this.modal = await this.modalController.create({
      component: OperationDetailsPage,
      componentProps: {
        'ops' : operations
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if(data != undefined){
      console.log(data.result);
    }
  }

  getFunctLocsByPlant(plantCode) {

    /*this.functlocService.getAllFunctLocByPlant(plantCode).subscribe(
      (locs)=>{
        this.locations = locs.d.results;
        console.log(this.locations)
      },
      (err) =>{
        console.log("Erreur",err)
      }
    )*/
  }




  reset() {
    /* this.notifFormGroup.controls.description.setValue("");
     this.notifFormGroup.controls.functloc.setValue("");
     this.notifFormGroup.controls.damageCode.setValue("");
     this.notifFormGroup.controls.equipment.setValue("");
     this.notifFormGroup.controls.productionEff.setValue("");
     this.notifFormGroup.controls.priority.setValue("");
     this.notifFormGroup.controls.objectPart.setValue("");
     this.notifFormGroup.controls.longText.setValue("");
     this.notifFormGroup.controls.cause.setValue("");
     this.notifFormGroup.controls.breakdownIndic.setValue("");*/
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
