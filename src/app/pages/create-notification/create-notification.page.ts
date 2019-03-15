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
import { CausecodeService } from 'src/app/providers/causecode.service';
import { CausegroupService } from 'src/app/providers/causegroup.service';
import { CauseGroupListPage } from '../cause-group-list/cause-group-list.page';
import { CauseCodeListPage } from '../cause-code-list/cause-code-list.page';
import { FunctLocListPage } from '../funct-loc-list/funct-loc-list.page';
import { EquipmentListPage } from '../equipment-list/equipment-list.page';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.page.html',
  styleUrls: ['./create-notification.page.scss'],
})
export class CreateNotificationPage extends BasePage implements OnInit {

  nbAttachments = 0;
  images = [];
  modal: any;
  choosenCG = "";
  choosenCC = "";
  choosenFunctLoc = "";
  choosenPlantcode = "";
  choosenEquipment = "";

  constructor(public _formBuilder: FormBuilder, public platform: Platform, public functlocService: FunctlocService,
    public qrScanner: QRScanner, public toastController: ToastController, private storage: Storage,
    public snackBar: MatSnackBar, public alertController: AlertController, public modalController: ModalController,
    private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
    private actionSheetController: ActionSheetController, private nativeStorage: NativeStorage,
    private plt: Platform, private loadingController: LoadingController, private effectService: EffectService,
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
    this.nativeStorage.getItem(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    },
      (err) => {
        console.log("Error", err)
      });
  }

  ionViewDidEnter() {
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

    this.modal = await this.modalController.create({
      component: FunctLocListPage,
      componentProps: {
        'plantCode': this.choosenPlantcode
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();

    if (data != undefined) {
      this.choosenFunctLoc = data.result.FunctLocId;
      this.selectEquipment();
    }
    else this.choosenFunctLoc = "";
  }

  async selectEquipment() {
    this.modal = await this.modalController.create({
      component: EquipmentListPage,
      componentProps: {
        'functLoc': this.choosenFunctLoc
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.choosenEquipment = data.result.EquipmentDescr;
    }
    else this.choosenEquipment = "";
  }

  async selectCauseGroup() {
    this.modal = await this.modalController.create({
      component: CauseGroupListPage,
      componentProps: {},
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.choosenCG = data.result.CodeGroup;
      this.selectCauseCode(this.choosenCG);
    }
  }

  async selectCauseCode(cg) {
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
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            this.nbAttachments++;
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    },
      (err) => {
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
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.openSnackBar('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.nativeStorage.getItem(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.nativeStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.nativeStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }
  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.nativeStorage.getItem(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.nativeStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.openSnackBar('File removed.');
      });
    });
  }

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
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


