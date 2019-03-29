import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotifHeader } from '../interfaces/notification.interface';
import NotifHeaderdata from '../mockServer/NotifHeaderSet.json';
import Plantdata from '../mockServer/PlanPlantSet.json';
import SOP from '../mockServer/OrderHeaderSet.json';
import Orderoperations from '../mockServer/OrderOperationSet.json';
import Ordercomponents from '../mockServer/OrderComponentSet.json';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor(private http: HttpClient) { }

  getAllMockNotifs(codePlant) {
    let notifList = NotifHeaderdata;
    return notifList.filter(
      (notif:any) =>{
        return notif.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      })
  }

  getAllMockPlants(){
    return Plantdata;
  }

  getAllMockSOP(codePlant){
    let SOPList = SOP;
    return SOPList.filter(
      (sop) =>{
        return sop.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      }
    )
  }

  getMockNotifByNumber(notifNo: string){
    console.log("notif n°: ",notifNo);
    let notifList = NotifHeaderdata;
    return notifList.filter(
      (notif:any) =>{
        if(notif.NotifNo != null){
          return notif.NotifNo.toLowerCase().indexOf(notifNo.toLowerCase()) > -1;
        }
      })
  }

  getMockOrderOperations(orderNo: string){
    let operations = Orderoperations;
    return operations.filter(
      (op) =>{
        return op.OrderNo.toLowerCase().indexOf(orderNo.toLowerCase()) > -1;
      }
    )
  }

  getMockOrderComponents(orderNo: string){
    let components = Ordercomponents;
    return components.filter(
      (cp) =>{
        if(cp.OrderNo != null && orderNo != null){
          return cp.OrderNo.toLowerCase().indexOf(orderNo.toLowerCase()) > -1;
        }
      }
    )
  }


}
