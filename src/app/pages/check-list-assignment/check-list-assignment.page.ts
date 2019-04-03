import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';
import { Storage } from '@ionic/storage';
import { Order } from 'src/app/interfaces/order.interface';
import { newOrder } from 'src/app/interfaces/newOrder.interface';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { MatTableDataSource } from '@angular/material';
import { MockService } from 'src/app/providers/mock.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ModalController } from '@ionic/angular';
import { ChecklistPage } from '../checklist/checklist.page';
import { SpeedDialFabPosition } from 'src/app/components/speed-dial-fab/speed-dial-fab.component';


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
  @ViewChild('tabGroup') tabGroup;
  orderList: any[] = [];
  ordersByType: newOrder[] = [];
  orderType = "";
  types: string[] = [];
  codePlant = "";
  newOrds: any[] = [];
  loading = false;
  noData = false;
  clicked = false;
  orders: any;
  refresh = false;
  ok = false;
  displayedColumns: string[] = [
    'OrderNo', 'StatusDescr',
    'FunctLoc', 'Operation',
    'Description', 'Checklist', 'prodStartDate', 'button', 'detail'
  ];
  displayedPortraitColumns: string[] = [
    'OrderNo',
    'FunctLoc', 'Operation',
    'Description', 'Checklist', 'button', 'detail'
  ];
  mock = false;
  orientation = "portrait-primary";
  modal : any;
  

  name = 'Angular 6';

  private speedDialFabButtons = [
    {
      icon: 'timeline',
      tooltip: 'Do some timeline here'
    },
    {
      icon: 'view_headline',
      tooltip: 'Do some headline here'
    },
    {
      icon: 'room',
      tooltip: 'get some room here'
    },
    {
      icon: 'lightbulb_outline',
      tooltip: 'Do some outline here'
    },
    {
      icon: 'lock',
      tooltip: 'Do lock down'
    }
  ];

  SpeedDialFabPosition = SpeedDialFabPosition;
  speedDialFabColumnDirection = 'column';
  speedDialFabPosition = SpeedDialFabPosition.Top;
  speedDialFabPositionClassName = 'speed-dial-container-top';

  constructor(private orderService: ServiceOrderPreparationService, private storage: Storage,
    private mockService: MockService, private screenOrientation: ScreenOrientation,private modalController: ModalController) {

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {
      this.setFilteredItems();

    });
    this.orientation = this.screenOrientation.type;
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        this.orientation = this.screenOrientation.type;
      }
    );
  }

  ngOnInit() {
    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null) {
          this.mock = mock;
        }
      })
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

  setFilteredItems() {
    this.orders = new MatTableDataSource(
      this.orderService.filterOrders(this.searchTerm, this.ordersByType));
  }

  getAllOrders(segmentIndex?: number) {
    this.loading = true;
    this.noData = false;
    this.orders = [];

    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null && choosenPlantcode != undefined) {
          this.codePlant = choosenPlantcode;
          this.getData(segmentIndex);
        }
      }).catch(
        (err) => {

        });
  }

  sortAlphaNumeric = (a, b) => {
    // convert to strings and force lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a.toString();
    b = typeof b === 'string' ? b.toLowerCase() : b.toString();

    return a.localeCompare(b);
  };

  getData(segmentIndex?: number) {
    if (this.mock) {
      this.orderList = this.mockService.getMockOrderByPlant(this.codePlant);
      let types = this.getOrderTypes(this.orderList);
      this.types = this.getUnique(types);

      if (this.types.length == 0) {
        this.loading = false;
        this.noData = true;
      }
      else {
        this.types.sort(this.sortAlphaNumeric);
        this.loading = false;
        this.noData = false;
        if (segmentIndex != null && segmentIndex != undefined) {
          this.orderType = this.types[segmentIndex];
        }
        else this.orderType = this.types[0];
        let ev = {
          tab: {
            textLabel: this.orderType
          }
        }
        this.segmentChanged(ev);
      }
    }
    else {
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
            this.types.sort(this.sortAlphaNumeric);
            this.loading = false;
            this.noData = false;
            if (segmentIndex != null && segmentIndex != undefined) {
              this.orderType = this.types[segmentIndex];
            }
            else this.orderType = this.types[0];
            let ev = {
              tab: {
                textLabel: this.orderType
              }
            }
            this.segmentChanged(ev);
          }
        }
      );
    }
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
    if (this.search != undefined) {
      this.search.value = "";
    }
    this.clicked = false;
    this.ok = false;
    let ords: newOrder[] = [];
    this.ordersByType = [];
    //this.loading = true;
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

    if (this.mock) {
      ords.forEach((element) => {
        let ops = this.mockService.getMockOrderOperations(element.orderPart.OrderNo);

        ops.forEach(op => {
          newOrds.push({
            orderPart: element.orderPart,
            Checklist: '',
            Description: op.Description,
            Operation: op.Activity,
            prodStartDate: this.formatDate(op.ProductionStartDate)
          });
        })
        this.ordersByType = newOrds;
        this.orders = new MatTableDataSource(this.ordersByType);
        this.ok = true;
        this.loading = false;
      })
    }
    else {
      console.log("from remote server");
      ords.forEach(async (element) => {
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
                  prodStartDate: this.formatDate(op.ProductionStartDate)
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
    }
  }

  //all checklists
  async presentCheckListsModal(index) {
    this.modal = await this.modalController.create({
      component: ChecklistPage,
      componentProps: {},
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if(data != undefined){
      if(data.result.Title.length > 22){
        let x = data.result.Title;
        this.orders.data[index].Checklist = x.slice(0,20)+"...";
      }
      else{
        this.orders.data[index].Checklist = data.result.Title;
      }
    }
  }

  removeCheckList(index){
    this.orders.data[index].Checklist = '';
  }

  onClose(evt: { result: string; }) {
    this.types = [];
    this.loading = true;
    this.getAllOrders();
  }

  doRefresh(event) {
    this.refresh = true;
    this.getAllOrders(this.tabGroup.selectedIndex);

    setTimeout(() => {
      event.target.complete();
      this.refresh = false;
    }, 3000);
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

  onPositionChange(position: SpeedDialFabPosition) {
    switch(position) {
      case SpeedDialFabPosition.Bottom:
        this.speedDialFabPositionClassName = 'speed-dial-container-bottom';
        this.speedDialFabColumnDirection = 'column-reverse';
        break;
      default:
        this.speedDialFabPositionClassName = 'speed-dial-container-top';
        this.speedDialFabColumnDirection = 'column';
    }
  }

  onSpeedDialFabClicked(btn: {icon: string}) {
    console.log(btn);
  }

}
