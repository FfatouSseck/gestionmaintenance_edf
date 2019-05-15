import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotificationService } from 'src/app/providers/notification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { BasePage } from '../base.page';

import { ChangeDetectorRef } from '@angular/core';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';

import { ActionSheetController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { File } from '@ionic-native/File/ngx';
import { PriorityService } from 'src/app/providers/priority.service';
import { FunctlocService } from '../../providers/functloc.service';
import { Storage } from '@ionic/storage';
import { EffectService } from 'src/app/providers/effect.service';
import { CausegroupService } from 'src/app/providers/causegroup.service';
import { MockService } from 'src/app/providers/mock.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { OfflineManagerService } from 'src/app/providers/offline-manager.service';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.page.html',
  styleUrls: ['./notification-details.page.scss'],
})
export class NotificationDetailsPage extends BasePage implements OnInit {
  choosenNotif: any;
  modif = false;
  readonly = true;
  notifDetailsFormGroup: FormGroup;
  notifFormGroup: FormGroup;
  @Input() mode: string;
  @Input() title: string;
  nbAttachments = 0;
  orientation = "";
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#005BBB'
    },
    dial: {
      dialBackgroundColor: '#005BBB',
    },
    clockFace: {
      clockFaceBackgroundColor: '#005BBB',
      clockHandColor: '#8c8c8c',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  choosenDC = ""  //choosen damage code
  choosenDG = ""  //choosen damage group
  choosenCG = ""; //choosen cause group
  choosenCC = ""; //choosen cause code
  choosenFunctLoc = "";
  choosenPlantcode = "";
  choosenEquipment = "";
  choosenObjectPartCode = "";
  choosenObjectPartGroup = "";


  // constructor(private modalCtrl: ModalController, private notifService: NotificationService,
  //   private _formBuilder: FormBuilder, private router: Router, private screenOrientation: ScreenOrientation) 
  constructor(public _formBuilder: FormBuilder, public platform: Platform, public functlocService: FunctlocService,
    public qrScanner: QRScanner, public toastController: ToastController, private storage: Storage,
    public snackBar: MatSnackBar, public alertController: AlertController, public modalController: ModalController,
    public actionSheetController: ActionSheetController, private router: Router,
    private effectService: EffectService, private priorityService: PriorityService,
    private causeGroupService: CausegroupService, private functLocService: FunctlocService, private mockService: MockService,
    public webview: WebView, private notificationService: NotificationService, private screenOrientation: ScreenOrientation,
    public ref: ChangeDetectorRef, public filePath: FilePath, public camera: Camera,
    public file: File, public http: HttpClient, public loadingController: LoadingController,
    public offlineService: OfflineManagerService) {

    super(_formBuilder, platform, functlocService, qrScanner, toastController, snackBar, alertController, modalController,
      webview, actionSheetController, ref, filePath, camera, file, http, loadingController
    );
    this.orientation = this.screenOrientation.type;
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        this.orientation = this.screenOrientation.type;
      }
    );
  }

  ngOnInit() {
    if (this.mode !== 'create') {
      this.choosenNotif = this.notificationService.getCurrentNotif();
      if (this.choosenNotif == undefined) {
        this.router.navigateByUrl("/notification-list");
      }
    }
    else {
      this.modif = undefined;
    }

    this.notifDetailsFormGroup = this._formBuilder.group({
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

    this.notifFormGroup = this._formBuilder.group({
      description: ['', Validators.required],
      functloc: ['', Validators.required],
      equipment: [''],
      productionEff: [''],
      priority: [''],
      startDate: ['', Validators.required],
      startHour: ['', Validators.required],
      damageCode: [''],
      cause: [''],
      objectPart: [''],
      longText: [''],
      breakdownIndic: ['']
    });

  }

  closeModal() {
    this.modalController.dismiss();
  }

  async selectFunctL() {
    if (this.readonly == false) {
      console.log("Clicked to select floc", this.choosenNotif.PlanPlant);
      this.choosenFunctLoc = await this.selectFirstLevelFLOC(this.choosenNotif.PlanPlant);

      this.choosenNotif.FunctLoc = this.choosenFunctLoc == undefined ? this.choosenNotif.FunctLoc : this.choosenFunctLoc;
      if (this.choosenFunctLoc !== "" && this.choosenFunctLoc != null && this.choosenFunctLoc != undefined) {
        await this.selectEquipment(this.choosenFunctLoc);
      }
    }
  }

  async selectEquipment(fl: string) {
    fl = this.choosenFunctLoc;
    if (this.readonly == false) {
      if (fl !== '' && fl != null && fl != undefined) {
        this.choosenEquipment = await this.selectEq(fl);
      }
      else this.openSnackBar("Please choose a functional location first");
    }
  }


  displaySimilarNotifs() {
    this.router.navigateByUrl("/similar-notifications");
  }

  ionViewDidEnter() {

  }

  // initDate(newD: string) {
  //   let d1 = newD.replace('/Date(', '');
  //   let startDate = d1.replace(')/', '');
  //   let newDate = new Date(Number(startDate));

  //   let m = newDate.getMonth() + 1;
  //   let d = newDate.getDate();
  //   let min = newDate.getMinutes();
  //   let h = newDate.getHours();
  //   let minutes = "";
  //   let month = "";
  //   let hours = "";
  //   let day = "";

  //   if (m.toString().length < 2) {
  //     month = "0" + m;
  //   } else month = m.toString();

  //   if (min.toString().length < 2) {
  //     minutes = "0" + min;
  //   } else minutes = min.toString();

  //   if (h.toString().length < 2) {
  //     hours = "0" + h;
  //   } else hours = h.toString();

  //   if (d.toString().length < 2) {
  //     day = "0" + d;
  //   } else day = d.toString();

  //   let datec = day + "/" + month + "/" + newDate.getFullYear() + " " + hours + ":" + minutes;
  //   return datec

  // }

}
