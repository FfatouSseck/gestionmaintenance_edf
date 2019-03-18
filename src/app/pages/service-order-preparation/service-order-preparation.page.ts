import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/interfaces/order.interface';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';

import { ModalController, Platform, ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MatSnackBar } from '@angular/material';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Router } from '@angular/router';
import { BaseOrderPage } from '../base.order.page';

@Component({
  selector: 'app-service-order-preparation',
  templateUrl: './service-order-preparation.page.html',
  styleUrls: ['./service-order-preparation.page.scss'],
})
export class ServiceOrderPreparationPage extends BaseOrderPage implements OnInit {

  searchTerm: string = '';
  modif = false;
  notAvailable = true;
  noData = false;

  ordersList:Order[] = []

  choosenOrder: Order = {
  };

  orientation = "landscape_primary";

  constructor(public modalController: ModalController, public _formBuilder: FormBuilder, public platform: Platform,
    public qrScanner: QRScanner, public toastController: ToastController, public orderService: ServiceOrderPreparationService,
    public snackBar: MatSnackBar, public alertController: AlertController, public storage: Storage,
    private screenOrientation: ScreenOrientation, public router: Router) {

    super(_formBuilder,platform,toastController,snackBar,alertController,modalController)

    this.orientation = this.screenOrientation.type;
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        this.orientation = this.screenOrientation.type;
      }
    );

  }

  ngOnInit() {
    this.orderFormGroup = this._formBuilder.group({
      description: ['', Validators.required],
      pmActType: ['', Validators.required],
      assignee: [''],
      functloc: ['',Validators.required],
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

  ionViewDidEnter() {
    let available = this.orderService.checkAvailability();
    if (available) {
      this.ordersList = this.orderService.filterOrders(this.searchTerm);
      if (this.ordersList[0].OrderNo != null) {
        this.notAvailable = false;
        this.noData = false;
        this.choosenOrder = this.ordersList[0];
      }
    }
    else {
      this.getOrders();
    }
  }

  onClose(evt) {
    this.notAvailable = true;
    this.getOrders();
  }

  getOrders(){
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
          this.orderService.getAllOrdersByChoosenPlant(choosenPlantcode).subscribe(
            (orders: any) => {
              if (orders.d.results.length > 0) {
                let done = this.orderService.setOrders(orders.d.results);
                if (done) {
                  this.ordersList = this.orderService.filterOrders(this.searchTerm);
                  console.log(orders.d.results);
                  this.choosenOrder = this.ordersList[0];
                  if (this.ordersList[0].OrderNo != null) {
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
