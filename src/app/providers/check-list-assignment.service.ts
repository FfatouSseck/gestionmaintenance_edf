import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CheckListAssignmentService extends BaseService {

  available = false;
  checklists: any[] = [];

  constructor(public http: HttpClient) { 
    super(http);
  }

  getChecklistsByPlant(codePlant){
    return this.getAll("ChecklistSet?$filter=Plant eq '"+codePlant+"'");
  }

  setCheckLists(cks){
    this.checklists = cks;
    if(this.checklists.length > 0){
      this.available = true;
    }
  }

  checkAvailability() {
    return this.available;
  }

  getAvailableCheckLists(){
    return this.checklists;
  }

  filterItems(searchTerm){
    return this.checklists.filter(
      (ck)=>{
        return (ck.ChklstId.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
          || ck.ChklstSiteId.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || ck.Title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      }
    )
  }


  geOrderOpChckToolSetByOrderNo(orderNo: string,codePlant: string,operation: string){
    return this.getAll("OrderOperationChecklistToolSet?$filter=Plant eq '"+codePlant+"' and OrderNo eq '"+orderNo+"' and Activity eq '"+operation+"'");
  }

  geOrderOperationChecklistPartSet(orderNo: string,codePlant: string,operation: string){
    return this.getAll("OrderOperationChecklistPartSet?$filter=Plant eq '"+codePlant+"' and OrderNo eq '"+orderNo+"' and Activity eq '"+operation+"'");
  }

  getOrderOperationChecklistCalbSet(orderNo: string,codePlant: string,operation: string){
    return this.getAll("OrderOperationChecklistCalbSet?$filter=Plant eq '"+codePlant+"' and OrderNo eq '"+orderNo+"' and Activity eq '"+operation+"'");
  }

  getOrderOperationChecklistTaskSet(orderNo: string,codePlant: string,operation: string){
    return this.getAll("OrderOperationChecklistTaskSet?$filter=Plant eq '"+codePlant+"' and OrderNo eq '"+orderNo+"' and Activity eq '"+operation+"'");
  }  

}
