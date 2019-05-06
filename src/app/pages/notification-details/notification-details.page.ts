import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotificationService } from 'src/app/providers/notification.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.page.html',
  styleUrls: ['./notification-details.page.scss'],
})
export class NotificationDetailsPage implements OnInit {
  choosenNotif: any;
  modif = false;
  notifDetailsFormGroup: FormGroup;
  notifFormGroup: FormGroup;
  @Input() mode: string;
  @Input() title: string;
  nbAttachments = 0;
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
  

  constructor(private modalCtrl: ModalController, private notifService: NotificationService,
    private _formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    if (this.mode !== 'create') {
      this.choosenNotif = this.notifService.getCurrentNotif();
      if (this.choosenNotif == undefined) {
        this.router.navigateByUrl("/notification-list");
      }
    }
    else{
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
    this.modalCtrl.dismiss();
  }


  displaySimilarNotifs() {
    this.router.navigateByUrl("/similar-notifications");
  }

  ionViewDidEnter() {

  }

  initDate(newD: string) {
    let d1 = newD.replace('/Date(', '');
    let startDate = d1.replace(')/', '');
    let newDate = new Date(Number(startDate));

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

    if (d.toString().length < 2) {
      day = "0" + d;
    } else day = d.toString();

    let datec = day + "/" + month + "/" + newDate.getFullYear() + " " + hours + ":" + minutes;
    return datec

  }

}
