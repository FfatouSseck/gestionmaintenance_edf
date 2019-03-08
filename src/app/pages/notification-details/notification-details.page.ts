import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotificationService } from 'src/app/providers/notification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.page.html',
  styleUrls: ['./notification-details.page.scss'],
})
export class NotificationDetailsPage implements OnInit {
  choosenNotif: any;
  modif = false;
  notifDetailsFormGroup: FormGroup;

  constructor(private modalCtrl:ModalController,private notifService: NotificationService,
              private _formBuilder:FormBuilder) { }

  ngOnInit() {
    this.choosenNotif =  this.notifService.getCurrentNotif();
    console.log(this.choosenNotif.startDate);

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
    
  }

  closeModal()
  {
    this.modalCtrl.dismiss();
  }

  ionViewDidEnter(){
    let d1 = this.choosenNotif.startDate.replace('/Date(','');
    let startDate = d1.replace(')/','');
    let newDate = new Date(Number(startDate));

    this.choosenNotif.startDate =  this.initDate(newDate);
  }

  initDate(newDate:Date){
    let m = newDate.getMonth() + 1;
    let d = newDate.getDate();
    let min = newDate.getMinutes();
    let h = newDate.getHours();
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

    if(d.toString().length < 2){
      day = "0"+d;
    }else day = d.toString();

    let datec = day + "/" + month + "/" + newDate.getFullYear() + " " + hours + ":" + minutes;
    return datec

  }

}
