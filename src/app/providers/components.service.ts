import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
   }

   getAllComponentsByActivity(orderNo: string,operationNo: string,codePlant: string){
    return this.getAll("OrderComponentSet?$filter=PlanPlant eq '"+ codePlant +"'and OrderNo eq '" + orderNo + "'and Activity eq '"+operationNo+"'");
   }
}
