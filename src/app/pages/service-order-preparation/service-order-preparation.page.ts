import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/interfaces/order.interface';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';

import { ModalController, Platform, ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Router } from '@angular/router';
import { BaseOrderPage } from '../base.order.page';
import { NotificationService } from 'src/app/providers/notification.service';
import { MockService } from 'src/app/providers/mock.service';
import { debounceTime } from 'rxjs/internal/operators';

@Component({
  selector: 'app-service-order-preparation',
  templateUrl: './service-order-preparation.page.html',
  styleUrls: ['./service-order-preparation.page.scss'],
})
export class ServiceOrderPreparationPage extends BaseOrderPage implements OnInit {

  operations: any[] = [];
  components: any[] = [];
  pmAct = "";
  orderStatus = "";
  searchTerm: string = '';
  searchControl: FormControl;
  @ViewChild('search') search: any;
  clicked = false;

  modif = false;
  notAvailable = true;
  noData = false;
  loadNotif = true;
  noComponents = false;
  noOperations = false;
  noNotif = false;
  refresh = false;

  ordersList: any[] = []

  choosenOrder: Order = {
    EquipUnderWarranty: null,
    WorkCenter: null,
    OrderNo: null,
    WorkCenterShort: null,
    PlanPlantDescr: null,
    WorkCenterDescr: null,
    EquipCustWarranty: null,
    PriorityDescr: null,
    EquipCustWarrantyDescr: null,
    Mine: null,
    EquipCustWarrantyStartDate: null,
    OrderType: null,
    EquipCustWarrantyEndDate: null,
    PmActivityType: null,
    EquipVendWarranty: null,
    PmActivityTypeDescr: null,
    EquipVendWarrantyDescr: null,
    PlanPlant: null,
    EquipVendWarrantyStartDate: null,
    FunctLoc: null,
    EquipVendWarrantyEndDate: null,
    FunctLocDescr: null,
    Equipment: null,
    FlocUnderWarranty: null,
    EquipmentDescr: null,
    FlocCustWarranty: null,
    FlocCustWarrantyDescr: null,
    NotifNo: null,
    FlocCustWarrantyStartDate: null,
    ShortText: null,
    FlocCustWarrantyEndDate: null,
    LongText: null,
    FlocVendWarranty: null,
    Priority: null,
    Assignee: null,
    FlocVendWarrantyDescr: null,
    AssigneeName: null,
    FlocVendWarrantyStartDate: null,
    FlocVendWarrantyEndDate: null,
    Status: null,
    StatusShort: null,
    StatusDescr: null,
    CreationDate: null,
    InProcess: null,
    Complete: null,
    Confirmed: null,
    TecoRefDate: null,
    TasklistGroup: null,
    TasklistGroupCounter: null,
    TasklistDescr: null
  };

  orientation = "landscape_primary";
  choosenNotif: any = {
    breakdownIndic: null,
    cause: "",
    damageCode: null,
    description: null,
    equipment: null,
    functloc: null,
    longText: null,
    NotifNo: null,
    objectPart: null,
    priority: null,
    productionEff: null,
    startDate: null
  };
  displayedColumns: string[] = ['Operation', 'Description', 'NumberOfCapacities',
    'WorkForecast', 'ActivityType', 'detail'];
  displayedComponentsColumns: string[] = ['Material', 'MaterialDescr', 'ItemNo',
    'PlanPlant', 'StgeLoc', 'ValType',
    'RequirementQuantity'];

  constructor(public modalController: ModalController, public _formBuilder: FormBuilder, public platform: Platform,
    public qrScanner: QRScanner, public toastController: ToastController, public orderService: ServiceOrderPreparationService,
    public snackBar: MatSnackBar, public alertController: AlertController, public storage: Storage, public mockService: MockService,
    private screenOrientation: ScreenOrientation, public router: Router, public notifService: NotificationService) {

    super(_formBuilder, platform, toastController, snackBar, alertController, modalController)

    this.orientation = this.screenOrientation.type;
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        this.orientation = this.screenOrientation.type;
      });
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {
      this.setFilteredItems();

    });

  }

  setFilteredItems(){
    this.ordersList = this.orderService.filterOrders(this.searchTerm);
  }

  ngOnInit() {
    this.orderFormGroup = this._formBuilder.group({
      description: ['', Validators.required],
      pmActType: ['', Validators.required],
      assignee: [''],
      functloc: ['', Validators.required],
      priority: [''],
      equipmentNo: [''],
      status: [''],
      text: [''],

      //for the notification
      notifNo: [''],
      breakdownIndic: [''],
      damageCode: [''],
      cause: [''],
      causeDescr: [''],
      objectPart: ['']
    });

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

  ionViewDidEnter() {
    this.getAllOrders();
  }

  getAllOrders(){
    this.loadNotif = true;
    this.operations = [];

    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null && mock == true) {
          this.getMockOrders();
        }
        else {
          let available = this.orderService.checkAvailability();
          if (available) {
            this.ordersList = this.orderService.getAllOrders();
            if (this.ordersList[0].OrderNo != null) {
              this.notAvailable = false;
              this.noData = false;
              if (this.choosenNotif.NotifNo != null) {
                this.loadNotif = false;
              }
            }
          }
          else {
            this.getOrders();
          }
        }
      })
  }

  doRefresh(event) {
    this.refresh = true;
    this.getAllOrders();

    setTimeout(() => {
      event.target.complete();
      this.refresh = false;
    }, 3000);
  }

  presentDetails(order: Order) {
    this.loadNotif = true;
    this.choosenOrder = order;
    let index = this.ordersList.indexOf(order);

    for (let i = 0; i < this.ordersList.length; i++) {
      this.ordersList[i].bgcolor = "white";
    }

    this.ordersList[index].bgcolor = "#F7F7F7";

    this.modif = false;

    this.orderService.setCurrentOrder(order);
    this.router.navigateByUrl("/order-details");
  }

  onClose(evt) {
    this.notAvailable = true;
    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null && mock == true) {
          this.getMockOrders();
        }
        else {
          this.getOrders();
        }
      })
  }

  getOrders() {
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
          this.orderService.getAllOrdersByChoosenPlant(choosenPlantcode).subscribe(
            (orders: any) => {
              if (orders.d.results.length > 0) {
                let done = this.orderService.setOrders(orders.d.results);
                if (done) {
                  this.ordersList = this.orderService.getAllOrders();
                  if (this.ordersList.length > 0) {
                    this.orderService.setOrders(this.ordersList);
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

  getMockOrders() {
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
          this.ordersList = this.mockService.getAllMockSOP(choosenPlantcode);
          if (this.ordersList.length > 0) {
            this.orderService.setOrders(this.ordersList);
            this.notAvailable = false;
            this.noData = false;
            if (this.choosenNotif.NotifNo != null) {
              this.loadNotif = false;
            }
          }
          else {
            this.notAvailable = false;
            this.noData = true;
          }
        }
      })
  }

}
