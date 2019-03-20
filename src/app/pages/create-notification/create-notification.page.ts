import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Platform, ToastController, AlertController, ModalController } from '@ionic/angular';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { BasePage } from '../base.page';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { finalize } from 'rxjs/operators';
import { PriorityService } from 'src/app/providers/priority.service';
import { FunctlocService } from '../../providers/functloc.service';
import { Storage } from '@ionic/storage';
import { EffectService } from 'src/app/providers/effect.service';
import { CausegroupService } from 'src/app/providers/causegroup.service';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.page.html',
  styleUrls: ['./create-notification.page.scss'],
})
export class CreateNotificationPage extends BasePage implements OnInit {

  nbAttachments = 0;
  images = [];
  arr = [];

  choosenDC = ""  //choosen damage code
  choosenDG = ""  //choosen damage group
  choosenCG = ""; //choosen cause group
  choosenCC = ""; //choosen cause code
  choosenFunctLoc = "";
  choosenPlantcode = "";
  choosenEquipment = "";
  choosenObjectPartCode = "";
  choosenObjectPartGroup = "";

  constructor(public _formBuilder: FormBuilder, public platform: Platform, public functlocService: FunctlocService,
    public qrScanner: QRScanner, public toastController: ToastController, private storage: Storage,
    public snackBar: MatSnackBar, public alertController: AlertController, public modalController: ModalController,
    private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
    private actionSheetController: ActionSheetController, private nativeStorage: NativeStorage,
    private loadingController: LoadingController, private effectService: EffectService,
    private ref: ChangeDetectorRef, private filePath: FilePath, private priorityService: PriorityService,
    private causeGroupService: CausegroupService, private functLocService: FunctlocService) {

    super(_formBuilder, platform, functlocService, qrScanner, toastController, snackBar, alertController, modalController);
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

  loadStoredImages() {
        this.images = [];
        for (let img of this.arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
   
  }

  ionViewDidEnter() {
    this.arr = [];
    this.images = [];
    //getting PrioritySet from server
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

    //we check if there is a choosen plant
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
          this.choosenPlantcode = choosenPlantcode;
          this.getFunctLocsByPlant(choosenPlantcode);
          //getting FunctLocSet from server
          if (this.functLocService.checkAvailability()) {
            this.locations = this.functLocService.getAvailableFunctLocs();
          }
          else {
            this.functLocService.getAllFunctLocByPlant(choosenPlantcode).subscribe(
              (locations) => {
                this.functLocService.setFunctLocs(locations.d.results);
                this.locations = this.functLocService.getAvailableFunctLocs();
              },
              (err) => {
                console.log(err);
              }
            )
          }
        }
        //otherwise we ask the user to choose a plant
        else this.presentPlantsModal();
      },
      (err) => {
        console.log("error", err);
      })

    //getting EffectSet from server
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

    //getting CauseGroupSet from server
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

  onClose(evt: { result: string; }) {
    this.choosenPlantcode = evt.result;
    this.choosenFunctLoc = "";
    this.choosenEquipment = "";
  }

  async selectFunctLoc() {
    this.choosenFunctLoc = await this.selectFLoc(this.choosenPlantcode);
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

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        icon: 'send',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Use Camera',
        icon: 'camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);

            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.openSnackBar("Android: correctPath: " + correctPath + " currentName: " + correctPath);

            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            this.nbAttachments++;
          });
      } else {
        this.openSnackBar("no ok")
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

        this.openSnackBar("correctPath: " + correctPath + " currentName: " + correctPath);

        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        this.nbAttachments++;
      }
    },
      () => {
        this.openSnackBar("Camera not available")
      });

  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(() => {
      this.updateStoredImages(newFileName);
    }, () => {
      this.openSnackBar('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.arr.push(name);

    let filePath = this.file.dataDirectory + name;
    let resPath = this.pathForImage(filePath);

    let newEntry = {
      name: name,
      path: resPath,
      filePath: filePath
    };

    this.images.push(newEntry, ...this.images);
    this.ref.detectChanges(); // trigger change detection cycle
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

      let filtered = this.arr.filter(name => name != imgEntry.name);

      var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(() => {
       // this.openSnackBar('File removed.');
       if(this.nbAttachments>0) this.nbAttachments--;
       else this.nbAttachments=0
      });
  }

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(() => {
        this.openSnackBar('Error while reading file.');
      });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('file', imgBlob, file.name);
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
      spinner: 'crescent',
      duration: 2000
    });
    await loading.present();

    this.http.post("http://localhost:8888/upload.php", formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        if (res['success']) {
          this.openSnackBar('File upload complete.')
        } else {
          this.openSnackBar('File upload failed.')
        }
      });
  }

  getFunctLocsByPlant(plantCode) {
    this.functlocService.getAllFunctLocByPlant(plantCode).subscribe(
      (functlocs) => {
        this.locations = functlocs.d.results;
      }
    )
  }




}


