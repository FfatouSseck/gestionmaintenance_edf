import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceOrderService extends BaseService{
  soList = [];
  available = false;
  currentSO: any;

  constructor(public http: HttpClient) { 
    super(http)
  }

  setSO(sOrders){
    let done = false;
    if (sOrders.length > 0) {
      this.soList = sOrders;
      done = true;
      this.available = true;
    }
    else this.available = false;

    return done;
  }

  setCurrentSO(sO){
    this.currentSO = sO;
  }

  getSOs(){
    return this.soList;
  }

  getAllOrdersByChoosenPlant(codePlant) {
    return this.getAll("OrderHeaderSet?$filter=PlanPlant eq '" + codePlant + "' and InProcess eq true");
  }

  filterSOs(searchTerm) {
    return this.soList.filter((ord) => {
      return (ord.OrderNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.StatusDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.FunctLoc.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });
  }
}
