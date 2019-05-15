import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Order } from '../interfaces/order.interface';

import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs';  // RxJS 6 syntax
import { newOrder } from '../interfaces/newOrder.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceOrderPreparationService extends BaseService {

  ordersList: Order[] = [];
  available = false;
  currentOrder: any;
  currentOrigin: any;

  constructor(public http: HttpClient) {
    super(http);
  }

  getOrdersByType(type:string,codePlant:string){
    return this.getAll("OrderHeaderSet?$filter=PlanPlant eq '" + codePlant + "'&OrderType eq '"+type+"'");
  }

  public requestDataFromMultipleSources(codePlant: string,orderNo?: string): Observable<any[]> {
    let response1 = this.getAllOrdersByChoosenPlant(codePlant);
    let response2 = this.getOrderOperations(orderNo);
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([response1, response2]);
  }

  getAllOrdersByChoosenPlant(codePlant) {
    return this.getAll("OrderHeaderSet?$filter=PlanPlant eq '" + codePlant + "' and InProcess eq false");
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

  getAllOrders(){
    return this.ordersList;
  }

  checkAvailability() {
    return this.available;
  }

  filterOrders1(searchTerm,orders: newOrder[]) {
    return orders.filter((ord) => {
      return (ord.orderPart.OrderNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.orderPart.StatusDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.orderPart.FunctLoc.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.Operation.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.Description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });
  }

  filterOrders(searchTerm) {
    return this.ordersList.filter((ord) => {
      return (ord.OrderNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.StatusDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || ord.FunctLoc.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });
  }

  setCurrentOrder(ord){
    this.currentOrder = ord;
  }

  setCurrentOrigin(origin){
    this.currentOrigin = origin;
  }

  getCurrentOrder(){
    return this.currentOrder;
  }

  getCurrentOrigin(){
    return this.currentOrigin;
  }
}
