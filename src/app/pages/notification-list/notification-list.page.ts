import { Component, OnInit } from '@angular/core';

import { ModalController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Notification } from '../../interfaces/notification.interface';
import { BasePage } from '../base.page';
import { FormBuilder, Validators } from '@angular/forms';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { NotificationService } from '../../providers/notification.service';
import { Storage } from '@ionic/storage';

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

  choosenNotif: Notification={
        breakdownIndic: null,
        cause: "",
        color: null,
        damageCode:null,
        description:null,
        equipment:null,
        functloc:null,
        longText:null,
        notifNumber:null,
        objectPart:null,
        priority:null,
        productionEff:null,
        startDate: null
  };

  constructor(public modalController: ModalController, public _formBuilder: FormBuilder, public platform: Platform,
    public qrScanner: QRScanner, public toastController: ToastController, public notifService: NotificationService,
    public snackBar: MatSnackBar, public alertController: AlertController, public storage: Storage) {

    super(_formBuilder, platform, qrScanner, toastController, snackBar, alertController);

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

  ionViewDidEnter(){
    
    let available = this.notifService.notifsAvailable();
    console.log("available",available);
    if (available) {
      this.notifList = this.notifService.filterNotifs(this.searchTerm);
      this.notAvailable = false;
    }
    else {
    
      this.getNotifs()
    }
  }

  presentDetails(notif: Notification) {
    this.choosenNotif = notif;
    this.modif = false;
    let index = this.notifList.indexOf(notif);

    for (let i = 0; i < this.notifList.length; i++) {
      // this.notifList[i].color=null
    }

    //this.notifList[index].color = "light";
  }

  modifyNotif() {
    this.modif = true;
  }

  getNotifs(){
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) =>{
        if (choosenPlantcode != null){
          this.notifService.getAllNotifs(choosenPlantcode).subscribe(
            (notifs: any) => {
              let done = this.notifService.setNotifs(notifs.d.results);
              if (done) {
                this.notifList = this.notifService.filterNotifs(this.searchTerm);
                this.choosenNotif = this.notifList[0];
                this.notAvailable = false;
              }
              else this.noData = true;
            },
            (err)=>{
              console.log(err);
              this.noData = true;
            }
          )
        }
        
      }
    )
  }

}
