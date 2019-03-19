import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Order } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceOrderPreparationService extends BaseService {

  ordersList: Order[] = [];
  available = false;
  currentOrder: any;

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllOrdersByChoosenPlant(codePlant) {
    return this.getAll("OrderHeaderSet?$filter=PlanPlant eq '" + codePlant + "'");
  }

  getOrderOperations(orderNo){
    return this.getAll("OrderHeaderSet('"+orderNo+"')/Operations");
  }

  getOrderComponents(orderNo){
    return this.getAll("OrderHeaderSet('"+orderNo+"')/Components");
  }

  setOrders(orders) {
    let done = false;
    if (orders.length > 0) {
      this.ordersList = orders;
      done = true;
      this.available = true;
    }
    else this.available = false;

    return done;
  }

  checkAvailability() {
    return this.available;
  }

  filterOrders(searchTerm) {
    return this.ordersList.filter((ord) => {
      return (ord.OrderNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.WorkCenter.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.PlanPlantDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.PlanPlant.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.WorkCenterShort.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });
  }

  setCurrentOrder(ord){
    this.currentOrder = ord;
  }

  getCurrentOrder(){
    return this.currentOrder;
  }
}
