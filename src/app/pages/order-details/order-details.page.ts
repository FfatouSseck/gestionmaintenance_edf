import { Component, OnInit } from '@angular/core';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/providers/notification.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  choosenOrder: any;
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
    'WorkForecast', 'ActivityType'];
  displayedComponentsColumns: string[] = ['Material', 'MaterialDescr', 'ItemNo',
    'PlanPlant', 'StgeLoc', 'ValType',
    'RequirementQuantity'];


  constructor(public orderService: ServiceOrderPreparationService, private modalCtrl: ModalController,
    private _formBuilder: FormBuilder,public notifService: NotificationService) { }

  ngOnInit() {
    this.choosenOrder = this.orderService.getCurrentOrder();
    console.log(this.choosenOrder);

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
    this.operations = [];
    this.loadNotif = true;
    
    this.pmAct = this.choosenOrder.PmActivityType + " - " + this.choosenOrder.PmActivityTypeDescr;
    this.orderStatus = this.choosenOrder.StatusShort + " - " + this.choosenOrder.StatusDescr;
    this.getOrderNotification(this.choosenOrder.NotifNo);
    this.getOrderOperations(this.choosenOrder.OrderNo);
    this.getOrderComponents(this.choosenOrder.OrderNo);
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

}
