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
import { FunctLocListPage } from './funct-loc-list/funct-loc-list.page';
import { EquipmentListPage } from './equipment-list/equipment-list.page';
import { CauseGroupListPage } from './cause-group-list/cause-group-list.page';
import { CauseCodeListPage } from './cause-code-list/cause-code-list.page';
import { ObjectPartGroupListPage } from './object-part-group-list/object-part-group-list.page';
import { ObjectPartCodeListPage } from './object-part-code-list/object-part-code-list.page';
import { DamageGroupPage } from './damage-group/damage-group.page';
import { DamageCodePage } from './damage-code/damage-code.page';

//import { QRScannerMock } from '@ionic-native-mocks/qr-scanner';

@Component({
  selector: 'app-base',
  styleUrls: [],
})
export class BasePage implements OnInit {

  notifFormGroup: FormGroup;
  modal: any;
  locations: any[] = [];

  productionEffects: ProductionEffect[] = [];
  causeCodes: CauseCode[] = [];
  causeGroups: CauseGroup[] = [];
  priorities: Priority[] = []
  today = new Date();
  dateauj = "";
  mobile = false;
  choosenFunctLoc = "";
  choosenEquipment = "";
  choosenCG = "";
  choosenCC = "";
  choosenObjectPartGroup = "";
  choosenObjectPartCode = "";
  choosenDG = "";
  choosenDC = "";

  constructor(public _formBuilder: FormBuilder, public platform: Platform, public functlocService: FunctlocService,
    public qrScanner: QRScanner, public toastController: ToastController,
    public snackBar: MatSnackBar, public alertController: AlertController, public modalController: ModalController) {

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

  async selectFLoc(plantCode: string) {
    this.modal = await this.modalController.create({
      component: FunctLocListPage,
      componentProps: {
        'plantCode': plantCode
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();

    if (data != undefined) {
      this.choosenFunctLoc = data.result.FunctLocId;
    }
    else this.choosenFunctLoc = "";

    return this.choosenFunctLoc;
  }

  async selectEq(fl: string){
    this.modal = await this.modalController.create({
      component: EquipmentListPage,
      componentProps: {
        'functLoc': fl
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } =await this.modal.onDidDismiss();
    if (data != undefined) {
      this.choosenEquipment = data.result.EquipmentDescr;
    }
    else this.choosenEquipment = "";

    return this.choosenEquipment;
  }

  async selectCG() {
    this.modal = await this.modalController.create({
      component: CauseGroupListPage,
      componentProps: {},
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.choosenCG = data.result.CodeGroup;
    }
    else this.choosenCG = "";

    return this.choosenCG;
  }

  async selectCC(cg: string) {
    this.modal = await this.modalController.create({
      component: CauseCodeListPage,
      componentProps: {
        'cg': cg
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.choosenCC = data.result.CodeDescr + " - " + this.choosenCG;
    }
    else this.choosenCC = "";

    return this.choosenCC;
  }

  async selectOPGroup() {
    this.modal = await this.modalController.create({
      component: ObjectPartGroupListPage,
      componentProps: {},
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.choosenObjectPartGroup = data.result.CodeGroup;
    }
    else this.choosenObjectPartGroup = "";

    return this.choosenObjectPartGroup;
  }
  
  async selectOPCode(og: string){
    this.modal = await this.modalController.create({
      component: ObjectPartCodeListPage,
      componentProps: {
        'og': og
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();

    if (data != undefined) {
      this.choosenObjectPartCode = data.result.CodeDescr + " - " + this.choosenObjectPartGroup;
    }
    else this.choosenObjectPartCode = "";

    return this.choosenObjectPartCode;
  }

  //Damage Codes & Groups
  async selectDG() {
    this.modal = await this.modalController.create({
      component: DamageGroupPage,
      componentProps: {},
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.choosenDG = data.result.CodeGroup;
    }
    else this.choosenDG = "";

    return this.choosenDG;
  }
  
  async selectDC(dg: string){
    this.modal = await this.modalController.create({
      component: DamageCodePage,
      componentProps: {
        'dg': dg
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();

    if (data != undefined) {
      this.choosenDC = data.result.CodeDescr + " - " + this.choosenDG;
    }
    else this.choosenDC = "";

    return this.choosenDC;
  }


  getFunctLocsByPlant(plantCode) {

    this.functlocService.getAllFunctLocByPlant(plantCode).subscribe(
      (locs) => {
        this.locations = locs.d.results;
        console.log(this.locations)
      },
      (err) => {
        console.log("Erreur", err)
      }
    )
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

    if (!this.mobile) {
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

  reset() {
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

