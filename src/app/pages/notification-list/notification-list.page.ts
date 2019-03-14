import { Component, OnInit } from '@angular/core';

import { ModalController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Notification } from '../../interfaces/notification.interface';
import { BasePage } from '../base.page';
import { FormBuilder, Validators } from '@angular/forms';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { NotificationService } from '../../providers/notification.service';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
})
export class NotificationListPage extends BasePage implements OnInit {
  searchTerm: string = '';
  modif = false;
  notAvailable = true;
  noData = false;

  notifList = []

  choosenNotif: Notification = {
    breakdownIndic: null,
    cause: "",
    color: null,
    damageCode: null,
    description: null,
    equipment: null,
    functloc: null,
    longText: null,
    notifNumber: null,
    objectPart: null,
    priority: null,
    productionEff: null,
    startDate: null
  };

  orientation = "landscape_primary";

  constructor(public modalController: ModalController, public _formBuilder: FormBuilder, public platform: Platform,
    public qrScanner: QRScanner, public toastController: ToastController, public notifService: NotificationService,
    public snackBar: MatSnackBar, public alertController: AlertController, public storage: Storage,
    private screenOrientation: ScreenOrientation,public router: Router) {

    super(_formBuilder, platform,null, qrScanner, toastController, snackBar, alertController,modalController);

    this.orientation = this.screenOrientation.type;
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        this.orientation = this.screenOrientation.type;
      }
    );

    //this.notifList[0].color="light";
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
    let available = this.notifService.notifsAvailable();
    if (available) {
      this.notifList = this.notifService.filterNotifs(this.searchTerm);
      console.log(this.notifList)
      if(this.notifList[0].notifNumber != null){
        this.notAvailable = false;
        this.noData = false;
      }
    }
    else {
      this.getNotifs();
    }
  }

  presentDetails(notif: Notification) {
    this.choosenNotif = notif;
    this.modif = false;
    let index = this.notifList.indexOf(notif);

    for (let i = 0; i < this.notifList.length; i++) {
      this.notifList[i].color = null
    }

    this.notifList[index].color = "light";
    this.notifService.setCurrentNotif(notif);
    if(this.orientation === 'portrait-primary'){
      this.router.navigateByUrl("/notification-details");
    }
  }

  updateNotif(notif){
    console.log(notif);
    this.notifService.updateNotif(notif.notifNumber,notif).subscribe(
      (not) =>{
        console.log("notiiiiiiif",not);
      },
      (err) =>{
        console.log("erreurrrrrrrrrrrrrrrr",err)
      }
    )
  }

  formatDate(newD:string){

    let d1 = newD.replace('/Date(','');
    let startDate = d1.replace(')/','');
    let newDate = new Date(Number(startDate));

    let m = newDate.getMonth() + 1;
    let d = newDate.getDate();
    let month = "";
    let day = "";

    if (m.toString().length < 2) {
      month = "0" + m;
    } else month = m.toString();

    if(d.toString().length < 2){
      day = "0"+d;
    }else day = d.toString();

    let datec = day + "/" + month + "/" + newDate.getFullYear();
    return datec

  }

  getHoursandMinutes(d){
    let d1 = d.replace('/Date(','');
    let startDate = d1.replace(')/','');
    let newDate = new Date(Number(startDate));

    let min = newDate.getMinutes();
    let h = newDate.getHours();
    let minutes = "";
    let hours = "";

    if (min.toString().length < 2) {
      minutes = "0" + min;
    } else minutes = min.toString();

    if (h.toString().length < 2) {
      hours = "0" + h;
    } else hours = h.toString();

    let dateD = this.formatDate(d) + " " + hours + ":" + minutes;
    return dateD;
  }

  modifyNotif() {
    this.modif = true;
  }

  getNotifs() {
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
          this.notifService.getAllNotifs(choosenPlantcode).subscribe(
            (notifs: any) => {
              if (notifs.d.results.length > 0) {
                let done = this.notifService.setNotifs(notifs.d.results);
                if (done) {
                  this.notifList = this.notifService.filterNotifs(this.searchTerm);
                  this.choosenNotif = this.notifList[0];
                  if(this.notifList[0].notifNumber != null){
                    this.notAvailable = false;
                    this.noData = false;
                  }         
                }
                else this.noData = true;
              }

              else {
                this.noData = true;
                this.notAvailable = false;
              }
            },
            (err) => {
              console.log(err);
              this.noData = true;
            }
          )
        }

      }
    )
  }

}
