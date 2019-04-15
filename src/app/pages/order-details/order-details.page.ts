import { Component, OnInit } from '@angular/core';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/providers/notification.service';
import { Storage } from '@ionic/storage';
import { MockService } from 'src/app/providers/mock.service';
import { OperationDetailsPage } from '../operation-details/operation-details.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  choosenOrder: any;
  noComponents = false;
  noOperations = false;
  noNotif = false;
  operations: any[] = [];
  components: any[] = [];
  pmAct = "";
  orderStatus = "";
  modif = false;
  orderDetailsFormGroup: FormGroup;
  loadNotif = true;
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
  modal: any;


  constructor(public orderService: ServiceOrderPreparationService, private modalCtrl: ModalController,
    private _formBuilder: FormBuilder, public notifService: NotificationService, public storage: Storage,
    private mockService: MockService, private modalController: ModalController, public router: Router) {
  }

  ngOnInit() {
    this.choosenOrder = this.orderService.getCurrentOrder();
    
    if( this.choosenOrder == undefined) {
      this.router.navigateByUrl("/service-order-preparation");
    }

    this.orderDetailsFormGroup = this._formBuilder.group({
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

  closeModal() {
    this.modalCtrl.dismiss();
  }

  ionViewDidEnter() {
    this.choosenOrder = this.orderService.getCurrentOrder();
    if (this.choosenOrder != undefined) {
      this.operations = [];
      this.loadNotif = true;

      this.pmAct = this.choosenOrder.PmActivityType + " - " + this.choosenOrder.PmActivityTypeDescr;
      this.orderStatus = this.choosenOrder.StatusShort + " - " + this.choosenOrder.StatusDescr;

      this.storage.get("mock").then(
        (mock) => {
          if (mock != undefined && mock != null && mock == true) {
            this.getMockNotifByNumber(this.choosenOrder.NotifNo);
            this.getMockOrderOperations(this.choosenOrder.OrderNo);
            this.getMockOrderComponents(this.choosenOrder.OrderNo);
          }
          else {
            this.getOrderNotification(this.choosenOrder.NotifNo);
            this.getOrderOperations(this.choosenOrder.OrderNo);
            this.getOrderComponents(this.choosenOrder.OrderNo);
          }
        });
    }
  }

  getMockNotifByNumber(notifNo) {
    this.noNotif = false;
    let choosenNotif = this.mockService.getMockNotifByNumber(notifNo)[0];
    if (choosenNotif == undefined) {
      this.noNotif = true;
      this.choosenNotif.NotifNo = null;
    }
    else {
      this.choosenNotif = choosenNotif;
    }
    this.loadNotif = false;
  }

  getMockOrderOperations(orderNo: string) {
    this.operations = [];
    this.noOperations = false;
    this.operations = this.mockService.getMockOrderOperations(orderNo);
    if (this.operations.length == 0) {
      this.noOperations = true;
    }
  }

  getMockOrderComponents(orderNo: string) {
    this.components = [];
    this.noComponents = false;
    this.components = this.mockService.getMockOrderComponents(orderNo);
    if (this.components.length == 0) {
      this.noComponents = true;
    }
  }

  getOrderNotification(notifNo) {
    this.notifService.getNotifByNumber(notifNo).subscribe(
      (notif) => {
        this.choosenNotif = notif.d;
        if (this.choosenNotif.NotifNo != null) {
          this.loadNotif = false;
        }
      }
    )
  }

  getOrderOperations(orderNo: string) {
    this.orderService.getOrderOperations(orderNo).subscribe(
      (operations) => {
        this.operations = operations.d.results;
      }
    )
  }

  getOrderComponents(orderNo: string) {
    this.orderService.getOrderComponents(orderNo).subscribe(
      (components) => {
        this.components = components.d.results;
      }
    )
  }

  getOperationDetails(index) {
    this.presentOperationModal(this.operations[index], 'detail');
  }

  addNewOperation() {
    this.presentOperationModal(null, 'create');
  }

  async presentOperationModal(operation, mode) {
    this.modal = await this.modalController.create({
      component: OperationDetailsPage,
      componentProps: {
        'op': operation,
        'mode': mode
      },
      cssClass: 'modal1'
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      console.log(data.result);
    }
  }

}
