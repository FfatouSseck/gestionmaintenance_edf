import { Component, OnInit } from '@angular/core';
import { ServiceOrderComponent } from 'src/app/components/service-order/service-order.component';
import { MockService } from 'src/app/providers/mock.service';
import { ServiceOrderService } from 'src/app/providers/service-order.service';
import { Storage } from '@ionic/storage';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-time-and-material-confirmation',
  templateUrl: './time-and-material-confirmation.page.html',
  styleUrls: ['./time-and-material-confirmation.page.scss'],
})
export class TimeAndMaterialConfirmationPage extends ServiceOrderComponent implements OnInit {

  constructor(public mockService: MockService, public orderService: ServiceOrderService,
    public storage: Storage, public orderPreparationService: ServiceOrderPreparationService,
    public router: Router) { 
      super( mockService,orderService,storage,orderPreparationService,router)
    }

  ngOnInit() {
    this.currentUrl = this.router.url; 
    this.getAllSOs();
  }

}
