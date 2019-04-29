import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Platform, ToastController, AlertController, ModalController } from '@ionic/angular';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { BasePage } from '../base.page';

import { ActionSheetController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

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

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.page.html',
  styleUrls: ['./create-notification.page.scss'],
})
export class CreateNotificationPage extends BasePage implements OnInit {

  nbAttachments = 0;


  choosenDC = ""  //choosen damage code
  choosenDG = ""  //choosen damage group
  choosenCG = ""; //choosen cause group
  choosenCC = ""; //choosen cause code
  choosenFunctLoc = "";
  choosenPlantcode = "";
  choosenEquipment = "";
  choosenObjectPartCode = "";
  choosenObjectPartGroup = "";

  mock = false;

  constructor(public _formBuilder: FormBuilder, public platform: Platform, public functlocService: FunctlocService,
    public qrScanner: QRScanner, public toastController: ToastController, private storage: Storage,
    public snackBar: MatSnackBar, public alertController: AlertController, public modalController: ModalController,
    public actionSheetController: ActionSheetController, private nativeStorage: NativeStorage,
    private effectService: EffectService, private priorityService: PriorityService,
    private causeGroupService: CausegroupService, private functLocService: FunctlocService, private mockService: MockService,
    public webview: WebView,
    public ref: ChangeDetectorRef, public filePath: FilePath, public camera: Camera,
    public file: File, public http: HttpClient, public loadingController: LoadingController, ) {

    super(_formBuilder, platform, functlocService, qrScanner, toastController, snackBar, alertController, modalController,
      webview, actionSheetController, ref, filePath, camera, file, http, loadingController
    );
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



  ionViewDidEnter() {
    this.arr = [];
    this.images = [];

    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null) {
          this.mock = mock;
        }
      })
      .finally(
        () => {
          //getting PrioritySet from server
          this.getPriorities();

          //we check if there is a choosen plant
          this.storage.get("choosenPlant").then(
            (choosenPlantcode) => {
              if (choosenPlantcode != null && choosenPlantcode != undefined) {
                this.choosenPlantcode = choosenPlantcode;
                //getting FunctLocSet from server
                this.getFunctLocsByPlant(choosenPlantcode);
              }
              //otherwise we ask the user to choose a plant
              else this.presentPlantsModal();
            },
            (err) => {
              console.log("error", err);
            })

          //getting EffectSet from server
          this.getEffects();

          //getting CauseGroupSet from server
          this.getCauseGroups();

        }
      )

  }

  onClose(evt: { result: any; }) {
    console.log("result:", evt);
    if (evt != undefined) {
      if (Array.isArray(evt.result)) {
        this.choosenPlantcode = evt.result[0].Plant;
    }
    else {
        console.log("ici")
        this.choosenPlantcode = evt.result.choosenPlant;
    }
      this.choosenFunctLoc = "";
      this.choosenEquipment = "";
    }
  }

  async selectFunctLoc() {
    this.choosenFunctLoc = await this.selectFirstLevelFLOC(this.choosenPlantcode);
    if (this.choosenFunctLoc !== "") {
      await this.selectEquipment(this.choosenFunctLoc);
    }
  }

  async selectEquipment(fl: string) {
    this.choosenEquipment = await this.selectEq(fl);
  }

  async selectCauseGroup() {
    this.choosenCG = await this.selectCG();
    if (this.choosenCG !== "") {
      await this.selectCauseCode(this.choosenCG);
    }
  }

  async selectCauseCode(cg: string) {
    this.choosenCC = await this.selectCC(cg);
  }

  async selectObjectPartGroup() {
    this.choosenObjectPartGroup = await this.selectOPGroup();
    if (this.choosenObjectPartGroup !== "") {
      await this.selectObjectPartCode(this.choosenObjectPartGroup);
    }
  }

  async selectObjectPartCode(og: any) {
    this.choosenObjectPartCode = await this.selectOPCode(og);
  }

  //Damage Codes & Groups
  async selectDamageGroup() {
    this.choosenDG = await this.selectDG();
    if (this.choosenDG !== "") {
      await this.selectDamageCode(this.choosenDG);
    }
  }

  async selectDamageCode(dg: string) {
    this.choosenDC = await this.selectDC(dg);
  }

  getFunctLocsByPlant(plantCode) {
    if (this.mock) {
      this.locations = this.mockService.getMockFunctLocsByPlant(plantCode);
      this.functLocService.setFunctLocs(this.locations);
    }
    else {
      this.functlocService.getAllFunctLocByPlant(plantCode).subscribe(
        (functlocs) => {
          this.locations = functlocs.d.results;
          this.functLocService.setFunctLocs(this.locations);
        });
    }
  }

  getEffects() {
    if (this.mock) {
      this.effectService.setEffects(this.mockService.getMockEffects());
      this.productionEffects = this.effectService.getEffects();
    }
    else {
      if (this.effectService.checkAvailability()) {
        this.productionEffects = this.effectService.getEffects();
      }
      else {
        this.effectService.getAllEffects().subscribe(
          (effects) => {
            this.effectService.setEffects(effects.d.results);
            this.productionEffects = this.effectService.getEffects();
          },
          (err) => {
            console.log(err);
          }
        )
      }
    }
  }

  getCauseGroups() {
    if (this.mock) {
      this.causeGroupService.setCauseGroups(this.mockService.getMockCG());
      this.causeGroups = this.causeGroupService.getAvailableCausegroups();
    }
    else {
      if (this.causeGroupService.checkAvailability()) {
        this.causeGroups = this.causeGroupService.getAvailableCausegroups();
      }
      else {
        this.causeGroupService.getAllCauseGroups().subscribe(
          (causegroups) => {
            this.causeGroupService.setCauseGroups(causegroups.d.results);
            this.causeGroups = this.causeGroupService.getAvailableCausegroups();
          },
          (err) => {
            console.log(err);
          }
        )
      }
    }
  }

  getPriorities() {
    if (this.mock) {
      this.priorityService.setPriorities(this.mockService.getMockPriorities());
      this.priorities = this.mockService.getMockPriorities();
    }
    else {
      if (this.priorityService.checkAvailability()) {
        this.priorities = this.priorityService.getPriorities();
      }
      else {
        this.priorityService.getAllPriorities().subscribe(
          (priorities) => {
            this.priorityService.setPriorities(priorities.d.results);
            this.priorities = this.priorityService.getPriorities();
          },
          (err) => {
            console.log(err);
          }
        )
      }
    }
  }



}


