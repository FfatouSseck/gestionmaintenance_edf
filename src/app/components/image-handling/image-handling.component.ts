import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { ActionSheetController, Platform, LoadingController } from '@ionic/angular';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-handling',
  templateUrl: './image-handling.component.html',
  styleUrls: ['./image-handling.component.scss'],
})
export class ImageHandlingComponent implements OnInit {
  nbAttachments = 0;
  images = [];
  arr = [];

  constructor(public webview: WebView, public actionSheetController: ActionSheetController,
    public ref: ChangeDetectorRef, public filePath: FilePath, public camera: Camera, public platform: Platform,
    public snackBar: MatSnackBar, public file: File, public http: HttpClient, public loadingController: LoadingController, ) { }

  ngOnInit() { }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
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
      if (this.nbAttachments > 0) this.nbAttachments--;
      else this.nbAttachments = 0
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


}
