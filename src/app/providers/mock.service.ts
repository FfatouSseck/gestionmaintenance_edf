import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotifHeader } from '../interfaces/notification.interface';
import * as NotifHeaderdata from '../mockServer/NotifHeaderSet.json';
import * as Plantdata from '../mockServer/PlanPlantSet.json';
import * as SOP from '../mockServer/OrderHeaderSet.json';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor(private http: HttpClient) { }

  getAllMockNotifs(codePlant) {
    let notifList = NotifHeaderdata.default;
    return notifList.filter(
      (notif:NotifHeader) =>{
        return notif.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      }
    )
  }

  getAllMockPlants(){
    return Plantdata.default;
  }

  getAllMockSOP(codePlant){
    let SOPList = SOP.default;
    return SOPList.filter(
      (sop) =>{
        return sop.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      }
    )
  }
}
