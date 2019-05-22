import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperationsService extends BaseService{

  constructor(public http: HttpClient) {
    super(http);
   }

  getOrderConfirmations(orderNo: string,operationNo: string,codePlant: string){
    return this.getAll("OrderConfirmationSet?$filter=PlanPlant eq '"+ codePlant +"'and OrderNo eq '" + orderNo + "'and Activity eq '"+operationNo+"'");
  }
}
