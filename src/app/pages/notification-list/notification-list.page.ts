import { Component, OnInit } from '@angular/core';

import { ModalController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Notification } from '../../interfaces/notification.interface';
import { BasePage } from '../base.page';
import { FormBuilder, Validators } from '@angular/forms';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
})
export class NotificationListPage extends BasePage implements OnInit {
  modif = false;

  notifList:Notification[]  = [
    {
      breakdownIndic: true,
      cause: "cause",
      damageCode: "AEFGR458",
      description: "Notification to reject",
      functloc: "CAT",
      equipment: "",
      productionEff: "Production restricted",
      priority: "Very High",
      startDate: "29/01/2019",
      objectPart: "test",
      longText: "test",
      notifNumber: '300330288'
    },
    {
      breakdownIndic: true,
      cause: "cause",
      damageCode: "7868353",
      description: "New Notification",
      functloc: "test",
      equipment: "",
      productionEff: "",
      priority: "High",
      startDate: "29/01/2019 14:00",
      objectPart: "test",
      longText: "test",
      notifNumber: "35028741"
    },
    {
      breakdownIndic: false,
      cause: "cause",
      damageCode: "BF4798YT",
      description: "third test with componentthird test with componentthird test with componentthird test with componentthird test with component",
      functloc: "test",
      equipment: "",
      productionEff: "",
      priority: "Very High",
      startDate: "29/01/2019",
      objectPart: "test",
      longText: "This is a looooooooooooong text",
      notifNumber: "75891792"
    },
    {
      breakdownIndic: true,
      cause: "cause",
      damageCode: "SD-23685",
      description: "Notification to reject",
      functloc: "test",
      equipment: "",
      productionEff: "test",
      priority: "Very High",
      startDate: "29/01/2019",
      objectPart: "test",
      longText: "test",
      notifNumber: "7984651284"
    },
    {
      breakdownIndic: false,
      cause: "cause",
      damageCode: "EF-7032689",
      description: "Notification to reject",
      functloc: "test",
      equipment: "",
      productionEff: "test",
      priority: "Very High",
      startDate: "29/01/2019",
      objectPart: "test",
      longText: "test",
      notifNumber: "69528528"
    }
  ]

  choosenNotif: Notification = this.notifList[0];

  constructor(public modalController: ModalController,public _formBuilder: FormBuilder, public platform: Platform,
    public qrScanner: QRScanner, public toastController: ToastController,
    public snackBar: MatSnackBar,public alertController: AlertController) {

      super(_formBuilder,platform,qrScanner,toastController,snackBar,alertController);
      this.notifList[0].color="light";
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

  presentDetails(notif: Notification) {
    this.choosenNotif = notif;
    this.modif = false;
    let index = this.notifList.indexOf(notif);

    for(let i=0;i<this.notifList.length;i++){
      this.notifList[i].color=null
    }

    this.notifList[index].color = "light";
  }

  modifyNotif(){
    this.modif = true;
  }

}
