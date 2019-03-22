import { Component, OnInit } from '@angular/core';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';
import { Storage } from '@ionic/storage';
import { Order } from 'src/app/interfaces/order.interface';
import { newOrder } from 'src/app/interfaces/newOrder.interface';

@Component({
  selector: 'app-check-list-assignment',
  templateUrl: './check-list-assignment.page.html',
  styleUrls: ['./check-list-assignment.page.scss'],
})
export class CheckListAssignmentPage implements OnInit {
  orderList: Order[] = [];
  ordersByType: newOrder[] = [];
  orderType = "";
  types: string[] = [];
  codePlant = "";
  displayedColumns: string[] = [
    'OrderNo', 'StatusDescr',
    'FunctLoc', 'Operation',
    'Description', 'Checklist', 'prodStartDate'
  ];
  public response2: any;
  newOrds: any[] = [];

  constructor(private orderService: ServiceOrderPreparationService, private storage: Storage) { }

  ngOnInit() {

  }

  getAllOrders() {
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null && choosenPlantcode != undefined) {
          this.codePlant = choosenPlantcode;
          /* this.orderService.getAllOrdersByChoosenPlant(choosenPlantcode).subscribe(
             (orders) =>{
               this.orderList = orders.d.results;
               let types = this.getOrderTypes(this.orderList);
               this.types=this.getUnique(types);
               this.orderType = this.types[0];
               //this.ordersByType.push(this.orderList[18]);
             }
           )*/
          this.orderService.requestDataFromMultipleSources(this.codePlant).subscribe(
            (responseList) => {
              this.orderList = responseList[0].d.results;
              let types = this.getOrderTypes(this.orderList);
              this.types = this.getUnique(types);
              this.orderType = this.types[0];
              let ev = {
                detail: {
                  value: this.orderType
                }
              }
              this.segmentChanged(ev);
              //console.log(orders);
            }
          );
        }
      }).catch(
        (err) => {

        }
      );
  }

  ionViewDidEnter() {
    this.getAllOrders();
  }

  async getData(newOrd: newOrder, tabOrders?: any[]) {
    this.orderService.requestDataFromMultipleSources(this.codePlant, newOrd.orderPart.OrderNo)
      .subscribe(
        (resp) => {
          let op = resp[1].d.results;
          op.forEach((element) => {
            tabOrders.push({
              orderPart: newOrd.orderPart,
              operation: {
                Checklist: '',
                Description: element.Description,
                Operation: element.Activity,
                prodStartDate: this.getHoursandMinutes(element.ProductionStartDate)
              }
            })
          });
          console.log(tabOrders);
        })
  }

  getOrderTypes(arr: Order[]) {
    let types: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      types.push(arr[i].OrderType);
    }
    return types;
  }

  getUnique(arr: string[]) {
    return arr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  segmentChanged(ev: any) {
    let ords: newOrder[] = [];
    this.ordersByType = [];
    let j = 0, i = 0, x = 0;

    for (i = 0; i < this.orderList.length; i++) {
      if (this.orderList[i].OrderType === ev.detail.value) {
        ords.push({
          orderPart: this.orderList[i]
        });
      }
    }
    //on recupere la ligne d'opération pour chaque ordre
    ords.forEach(async (element, index) => {
      this.orderService.getOrderOperations(element.orderPart.OrderNo)
        .subscribe(
          (operations) => {
            //tabOperations.push(operations.d.results)
            let ops = operations.d.results;
            //console.log(index+1,"- Les opérations pour ",element.orderPart.OrderNo,ops);
            ords[index].opRTab = ops;
          });
    });

    let orders = ords;
    this.getFullTab(orders);

  }

  getFullTab(orders: newOrder[]) {
    let fullTab: newOrder[] = [];

    console.log("orders",  JSON.stringify(orders[0]));
   /* for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].opRTab.length; j++) {
        fullTab.push({
          Checklist: '',
          Description: orders[i].opRTab[j].Description,
          Operation:  orders[i].opRTab[j].Activity,
          prodStartDate: this.getHoursandMinutes(orders[i].opRTab[j].ProductionStartDate)
        })
      }
    }*/

    console.log("Full tab",fullTab);
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

  getOrderOp(orderNo) {
    let opR = [];
    this.orderService.getOrderOperations(orderNo).subscribe(
      (operations) => {
        opR = operations.d.results
        return opR;
      },
      (err) => {
        console.log("Erreur: ", err);
      });
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

    let datec = day + "/" + month + "/" + newDate.getFullYear();
    return datec

  }

}
