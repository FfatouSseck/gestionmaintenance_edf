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

  constructor(private orderService: ServiceOrderPreparationService,private storage: Storage) { }

  ngOnInit() {

  }

  getAllOrders(){
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if(choosenPlantcode != null && choosenPlantcode != undefined){
          this.codePlant = choosenPlantcode;
          this.orderService.getAllOrdersByChoosenPlant(choosenPlantcode).subscribe(
            (orders) =>{
              this.orderList = orders.d.results;
              let types = this.getOrderTypes(this.orderList);
              this.types=this.getUnique(types);
              this.orderType = this.types[0];
              //this.ordersByType.push(this.orderList[18]);
            }
          )
        }
      }).catch(
        (err)=>{

        }
      );
  }

  ionViewDidEnter(){
    this.getAllOrders();
  }

  getOrderTypes(arr:Order[]){
    let types: string[] = [];
    for(let i=0;i<arr.length;i++){
      types.push(arr[i].OrderType);
    }
    return types;
  }

  getUnique(arr:string []) {
    return arr.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  segmentChanged(ev: any) {
    let cpt = 0;
    let ords: newOrder[] = [];
    let newOrds: newOrder[] = [];
    let j=0,i=0,x=0;

    for(i=0;i<this.orderList.length;i++){
      if(this.orderList[i].OrderType === ev.detail.value){
        ords.push({
          orderPart: this.orderList[i]
        });
      }
    }

    ords.forEach(function(item, i){
      this.getOrderOperations(item.orderPart.OrderNo);
    });
   /* for(x=0;x<ords.length;x++){
      await this.getOrderOperations(ords[x].orderPart.OrderNo);
      //console.log("Nombre d'opérations pour ",ords[x].orderPart.OrderNo,"= ",op.length);
    
          /*for(let j=0;j<op.length;j++){
            let newOrd : newOrder;
            console.log(j)
            newOrd = {
              orderPart: ords[i].orderPart
            }
            newOrd.Checklist = '';
            newOrd.Description = op[j].Description;
            newOrd.Operation = op[j].Activity;
            newOrd.prodStartDate = this.getHoursandMinutes(op[j].ProductionStartDate);

            this.newOrds.push(newOrd);
          }
          
          //console.log(this.ordersByType,ev.detail.value);
    }*/
  }

  getOrderOperations(orderNo){
    let opR =[];
    this.orderService.getOrderOperations(orderNo).subscribe(
      (operations) =>{
        console.log(operations.d.results);
        opR = operations.d.results
       // return op;
      });
      console.log(opR);
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
