import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { ModalController, Platform, ToastController, AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { Notification, NotificationLight, NotifHeader } from '../../interfaces/notification.interface';
import { BasePage } from '../base.page';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { NotificationService } from '../../providers/notification.service';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Router } from '@angular/router';
import { Priority } from 'src/app/interfaces/priority.interface';
import { PriorityService } from 'src/app/providers/priority.service';
import { MockService } from 'src/app/providers/mock.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/File/ngx';
import { debounceTime } from 'rxjs/internal/operators';

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
  floc = "";
  cause = "";
  objectPart = "";

  searchControl: FormControl;
  @ViewChild('search') search: any;
  @ViewChild('select') select;
  clicked = false;
  refresh = false;

  choosenDC = ""  //choosen damage code
  choosenDG = ""  //choosen damage group
  choosenCG = ""; //choosen cause group
  choosenCC = ""; //choosen cause code
  choosenFunctLoc = "";
  choosenPlantcode = "";
  choosenEquipment = "";
  choosenObjectPartCode = "";
  choosenObjectPartGroup = "";

  notifList: any[] = [];
  choosenNotif: NotifHeader = {
    NotifNo: null
  };

  priorities: Priority[] = []

  orientation = "landscape_primary";
  mock = false;

  constructor(public modalController: ModalController, public _formBuilder: FormBuilder, public platform: Platform,
    public qrScanner: QRScanner, public toastController: ToastController, public notifService: NotificationService,
    public snackBar: MatSnackBar, public alertController: AlertController, public storage: Storage,
    private screenOrientation: ScreenOrientation, public router: Router,
    public priorityService: PriorityService, public mockService: MockService,
    public webview: WebView,
    public ref: ChangeDetectorRef, public filePath: FilePath, public camera: Camera,
    public file: File, public http: HttpClient, public loadingController: LoadingController,
    public actionSheetController: ActionSheetController) {

    super(_formBuilder, platform, null, qrScanner, toastController, snackBar, alertController, modalController,
      webview, actionSheetController, ref, filePath, camera, file, http, loadingController);

    this.orientation = this.screenOrientation.type;
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        this.orientation = this.screenOrientation.type;
      }
    );

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {
      this.setFilteredItems();

    });

    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null) {
          this.mock = mock;
        }
      });
  }

  setFilteredItems() {
    this.notifList = this.notifService.filterNotifs(this.searchTerm);
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
    this.getAllNotifs();
  }

  doRefresh(event) {
    this.refresh = true;
    this.getAllNotifs();

    setTimeout(() => {
      event.target.complete();
      this.refresh = false;
    }, 3000);
  }

  toggleSearch() {
    if (this.clicked) {
      this.clicked = false;
    } else {
      this.clicked = true;
      setTimeout(() => {
        this.search.setFocus();
      }, 100);
    }
  }

  openSelect(evt){
    this.select.open();
  }

  getAllNotifs() {
    let available = this.notifService.notifsAvailable();
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null && choosenPlantcode != null && choosenPlantcode != undefined) {
          this.choosenPlantcode = choosenPlantcode;
          if (this.mock) {
            this.getMockNotifs(this.choosenPlantcode);
          }
          else {
            if (available) {
              this.notifList = this.notifService.filterNotifs(this.searchTerm);
              if (this.notifList[0].NotifNo != null) {
                this.notAvailable = false;
                this.noData = false;
              }
            }
            else {
              this.getNotifs();
            }
          }
        }
        else {
          this.notAvailable = false;
          this.noData = true;
        }
      });

    //getting PrioritySet from server
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

  getMockNotifs(plant) {
    this.notAvailable = true;
    let notifNumbers: any[] = []
    let ntfs = this.mockService.getAllMockNotifs(plant);
    this.notifList = ntfs;
    //var sortedArray:Array<number> = this.notifList.sort((n1,n2) => n1 - n2);
    this.notifList.forEach(nt => {
      let stringNum: number = +nt.NotifNo;
      notifNumbers.push(stringNum)
    });

    //console.log("Sorted notifs by date", this.sortByStartDate(ntfs));
    //console.log("Sorted notifs notifNo", this.sortByNotifNo(ntfs));
    //console.log("Sorted notifs priority", this.sortByPriority(ntfs));
    this.notifService.setNotifs(ntfs);
    if (this.notifList.length == 0) {
      this.notAvailable = false;
      this.noData = true;
    }
    else {
      if (this.notifList[0].NotifNo != null) {
        this.notAvailable = false;
        this.noData = false;
        this.notifService.setNotifs(this.notifList);
      }
    }


  }

  sortBy(event) {
    let option = event.detail.value;
    if (option === 'startDate') {
      this.notifList = this.sortByStartDate(this.notifList);
    }
    else if (option === 'priority') {
      this.notifList = this.sortByPriority(this.notifList);
    }
    else if (option === 'notifNo') {
      this.notifList = this.sortByNotifNo(this.notifList);
    }
    else if (option === 'floc') {
      this.notifList.sort(this.sortAlphaNumeric);
    }
  }

  sortByPriority(tab) {
    return tab.sort(
      function (a, b) {
        if (+a.Priority < +b.Priority) {
          return -1;
        }
        else if (+a.Priority > +b.Priority) {
          return 1;
        }
        else return 0;
      })
  }

  sortByNotifNo(tab) {
    return tab.sort(
      function (a, b) {
        if (+a.NotifNo < +b.NotifNo) {
          return -1;
        }
        if (+a.NotifNo > +b.NotifNo) {
          return 1;
        }
        return 0;
      })
  }

  sortByFLOC(tab) {
    return tab.sort(
      function (a, b) {
        if (a.FunctLoc < b.FunctLoc) {
          return -1;
        }
        if (a.FunctLoc > b.FunctLoc) {
          return 1;
        }
        return 0;
      })
  }

  sortAlphaNumeric = (a, b) => {
    // convert to strings and force lowercase
    a.FunctLoc = typeof a.FunctLoc === 'string' ? a.FunctLoc : a.FunctLoc.toString();
    b.FunctLoc = typeof b.FunctLoc === 'string' ? b.FunctLoc : b.FunctLoc.toString();

    return a.FunctLoc.localeCompare(b.FunctLoc);
  };

  getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  stringToDate(dateString) {
    const [dd, mm, yyyy] = dateString.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  };

  sortByStartDate(tab) {
    let sortedTab: any[] = [];
    sortedTab = tab.sort((a: any, b: any) => {

      if (this.getTime(this.stringToDate(this.formatDate(a.StartDate))) <
        this.getTime(this.stringToDate(this.formatDate(b.StartDate)))) {
        return -1;
      }
      else if (this.getTime(this.stringToDate(this.formatDate(a.StartDate))) >
        this.getTime(this.stringToDate(this.formatDate(b.StartDate)))) {
        return 1;
      }
      else {
        return 0;
      }
    });
    return sortedTab;
  }

  onClose(evt) {
    this.notAvailable = true;
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
          this.choosenPlantcode = choosenPlantcode;
        }
      });
    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null && mock == true) {
          this.getMockNotifs(this.choosenPlantcode);
        }
        else {
          this.getNotifs();
        }
      });

  }

  presentDetails(notif: NotifHeader) {
    this.choosenNotif = notif;
    this.modif = false;
    let index = this.notifList.indexOf(notif);

    /*if (this.orientation !== 'portrait-primary') {
      for (let i = 0; i < this.notifList.length; i++) {
        this.notifList[i].bgcolor = "white";
        this.notifList[i].color = "black";
        this.notifList[i].fw = "normal";
      }
      this.notifList[index].color = "black";
      this.notifList[index].fw = "bold";
    }*/

    for (let i = 0; i < this.notifList.length; i++) {
      this.notifList[i].bgcolor = "white";
    }
    this.notifList[index].bgcolor = "#F7F7F7";

    this.floc = this.choosenNotif.FunctLoc + " " + this.choosenNotif.FunctLocDescr;
    this.choosenFunctLoc = this.choosenNotif.FunctLoc;
    this.choosenDC = this.choosenNotif.DamageCode + " " + this.choosenNotif.DamageCodeDescr;
    this.cause = this.choosenNotif.CauseCode + " " + this.choosenNotif.CauseDescr;
    this.objectPart = this.choosenNotif.ObjectPartCode + " " + this.choosenNotif.ObjectPartCodeDescr;
    this.choosenCC = this.cause;
    this.choosenObjectPartCode = this.objectPart;

    this.notifService.setCurrentNotif(notif);
    this.router.navigateByUrl("/notification-details");
  }

  updateNotif(notif: Notification) {
    console.log(notif);
    let notification: NotificationLight = {
      description: notif.description,
      functloc: notif.functloc,
      equipment: notif.equipment,
      productionEff: notif.productionEff,
      priority: notif.priority,
      startDate: notif.startDate,
      damageCode: notif.damageCode,
      cause: notif.cause,
      objectPart: notif.objectPart,
      longText: notif.longText,
      breakdownIndic: notif.breakdownIndic,
      notifNumber: notif.notifNumber,
    }
    this.notifService.updateNotif(notif.notifNumber, notification).subscribe(
      (not) => {
        console.log("notiiiiiiif", not);
      },
      (err) => {
        console.log(err)
      }
    )
  }

  formatDate(newD: string) {

    let d1 = newD.replace('/Date(', '');
    let startDate = d1.replace(')/', '');
    let newDate = new Date(Number(startDate));

    let m = newDate.getMonth() + 1;
    let d = newDate.getDate();
    let month = "";
    let day = "";

    if (m.toString().length < 2) {
      month = "0" + m;
    } else month = m.toString();

    if (d.toString().length < 2) {
      day = "0" + d;
    } else day = d.toString();

    let datec = day + "-" + month + "-" + newDate.getFullYear();
    return datec

  }

  getHoursandMinutes(d) {
    let d1 = d.replace('/Date(', '');
    let startDate = d1.replace(')/', '');
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

  displaySimilarNotifs() {
    this.router.navigateByUrl("/similar-notifications");
  }

  modifyNotif() {
    this.modif = true;
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  getNotifs() {
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
          this.choosenPlantcode = choosenPlantcode;
          this.notifService.getAllNotifs(choosenPlantcode).subscribe(
            (notifs: any) => {
              if (notifs.d.results.length > 0) {
                let done = this.notifService.setNotifs(notifs.d.results);
                if (done) {
                  this.notifList = this.notifService.filterNotifs(this.searchTerm);
                  if (this.notifList[0].NotifNo != null) {
                    this.notAvailable = false;
                    this.noData = false;
                    this.notifService.setNotifs(this.notifList);
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
            })
        }
      })
  }

  async selectFunctLoc() {
    let functLoc = "";
    if (this.choosenFunctLoc !== "") {
      functLoc = this.choosenFunctLoc;
    }

    this.choosenFunctLoc = await this.selectFLoc(this.choosenPlantcode);

    if (this.choosenFunctLoc !== "") {
      await this.selectEquipment(this.choosenFunctLoc);
    }
    else {
      this.choosenFunctLoc = functLoc;
    }
  }

  async selectEquipment(fl: string) {
    let eq = "";
    if (this.choosenEquipment !== "") {
      eq = this.choosenEquipment;
    }
    this.choosenEquipment = await this.selectEq(fl);
    if (this.choosenEquipment === "") {
      this.choosenEquipment = eq;
    }
  }

  async selectCauseGroup() {
    let cg = "";
    if (this.choosenCG !== "") {
      cg = this.choosenCG;
    }
    this.choosenCG = await this.selectCG();

    if (this.choosenCG !== "") {
      await this.selectCauseCode(this.choosenCG);
    }
    else {
      this.choosenCG = cg;
    }
  }

  async selectCauseCode(cg: string) {
    let cc = "";
    if (this.choosenCC !== "") {
      cc = this.choosenCC;
    }
    this.choosenCC = await this.selectCC(cg);
    if (this.choosenCC === "") {
      this.choosenCC = cc;
    }
  }

  async selectObjectPartGroup() {
    let opg = "";
    if (this.choosenObjectPartGroup !== "") {
      opg = this.choosenObjectPartGroup;
    }
    this.choosenObjectPartGroup = await this.selectOPGroup();
    if (this.choosenObjectPartGroup !== "") {
      await this.selectObjectPartCode(this.choosenObjectPartGroup);
    }
    else {
      this.choosenObjectPartGroup = opg;
    }
  }

  async selectObjectPartCode(og: any) {
    let opc = "";
    if (this.choosenObjectPartCode !== "") {
      opc = this.choosenObjectPartCode;
    }
    this.choosenObjectPartCode = await this.selectOPCode(og);
    if (this.choosenObjectPartCode === "") {
      this.choosenObjectPartCode = opc;
    }
  }

  //Damage Codes & Groups
  async selectDamageGroup() {
    let dg = "";
    if (this.choosenDG !== "") {
      dg = this.choosenDG;
    }
    this.choosenDG = await this.selectDG();
    if (this.choosenDG !== "") {
      await this.selectDamageCode(this.choosenDG);
    }
    else {
      this.choosenDG = dg;
    }
  }

  async selectDamageCode(dg: string) {
    let dc = "";
    if (this.choosenDC !== "") {
      dc = this.choosenDC;
    }
    this.choosenDC = await this.selectDC(dg);
    if (this.choosenDC === "") {
      this.choosenDC = dc;
    }
  }


}
