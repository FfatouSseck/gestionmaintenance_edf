import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';
import { Storage } from '@ionic/storage';
import { Order } from 'src/app/interfaces/order.interface';
import { newOrder } from 'src/app/interfaces/newOrder.interface';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-check-list-assignment',
  templateUrl: './check-list-assignment.page.html',
  styleUrls: ['./check-list-assignment.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckListAssignmentPage implements OnInit {


  searchTerm: string = '';
  searchControl: FormControl;
  @ViewChild('search') search: any;
  orderList: Order[] = [];
  ordersByType: newOrder[] = [];
  orderType = "";
  types: string[] = [];
  codePlant = "";
  newOrds: any[] = [];
  loading = false;
  noData = false;
  clicked = false;
  orders:any;
  refresh = false;
  ok = false;
  displayedColumns: string[] = [
    'OrderNo', 'StatusDescr',
    'FunctLoc', 'Operation',
    'Description', 'Checklist', 'prodStartDate','button'
  ];



  constructor(private orderService: ServiceOrderPreparationService, private storage: Storage) {

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {
      this.setFilteredItems();

    });
  }

  ngOnInit() {

  }

  toggleSearch() {
    if (this.clicked) {
      this.clicked = false;
    } else {
      this.clicked = true;
      setTimeout(() => {
        this.search.setFocus();
      }, 500);

    }
  }

  setFilteredItems() {
    this.ordersByType = this.orderService.filterOrders(this.searchTerm, this.orders);
  }

  getAllOrders() {
    this.loading = true;
    this.noData = false;

    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null && choosenPlantcode != undefined) {
          this.codePlant = choosenPlantcode;
          this.orderService.requestDataFromMultipleSources(this.codePlant).subscribe(
            (responseList) => {
              this.orderList = responseList[0].d.results;
              let types = this.getOrderTypes(this.orderList);
              this.types = this.getUnique(types);
              if (this.types.length == 0) {
                this.loading = false;
                this.noData = true;
              }
              else {
                this.loading = false;
                this.noData = false;
                this.orderType = this.types[0];
                let ev = {
                  tab: {
                    textLabel: this.orderType
                  }
                }
                console.log(this.segmentChanged(ev));
              }
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
    this.ok = false;
    let ords: newOrder[] = [];
    this.ordersByType = [];
    this.loading = true;
    let i = 0;

    for (i = 0; i < this.orderList.length; i++) {
      if (this.orderList[i].OrderType === ev.tab.textLabel) {
        ords.push({
          orderPart: this.orderList[i]
        });
      }
    }

    let newOrds = [];
    //on recupere la ligne d'opération pour chaque ordre
    ords.forEach(async (element, index) => {
      this.orderService.getOrderOperations(element.orderPart.OrderNo)
        .subscribe(
          (operations) => {
            let ops = operations.d.results;
            ops.forEach(op => {
              newOrds.push({
                orderPart: element.orderPart,
                Checklist: '',
                Description: op.Description,
                Operation: op.Activity,
                prodStartDate: this.getHoursandMinutes(op.ProductionStartDate)
              });
            });

          },
          error => console.log("Error: ", error),
          async () => {
            this.ordersByType = newOrds;
            this.orders = await new MatTableDataSource(this.ordersByType);
            this.ok = true;
            this.loading = false;
          }
        );
    });

    /*let newOne  = [];
    newOne.push("ici","laba");
    console.log("orders: ",this.orders," length: ",this.orders.length);
    

    newOrds.forEach(element => {
      newOne.push(element);
      console.log("element",element)
    });
    console.log("newOne: ",newOne," length: ",newOne.length);*/
    return newOrds;

  }

  onClose(evt: { result: string; }) {
    this.types = [];
    this.loading = true;
    this.getAllOrders();
  }

  doRefresh(event) {
    this.refresh = true;
    this.getAllOrders();

    setTimeout(() => {
      event.target.complete();
      this.refresh = false;
    }, 3000);
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
