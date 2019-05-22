import { Injectable } from '@angular/core';
import NotifHeaderdata from '../mockServer/NotifHeaderSet.json';
import Plantdata from '../mockServer/PlanPlantSet.json';
import SOP from '../mockServer/OrderHeaderSet.json';
import Orderoperations from '../mockServer/OrderOperationSet.json';
import Ordercomponents from '../mockServer/OrderComponentSet.json';
import FunctLocs from '../mockServer/FunctLocSet.json';
import Priorities from '../mockServer/PrioritySet.json';
import Effects from '../mockServer/EffectSet.json';
import CauseGroupSet from '../mockServer/CauseGroupSet.json';
import CauseCodeSet from '../mockServer/CauseCodeSet.json';
import EquipmentSet from '../mockServer/EquipmentSet.json';
import DamageCodeSet from '../mockServer/DamageCodeSet.json';
import DamageGroupSet from '../mockServer/DamageGroupSet.json';
import ObjectPartCodeSet from '../mockServer/ObjectPartCodeSet.json';
import ObjectPartGroupSet from '../mockServer/ObjectPartGroupSet.json';
import OrderHeaderSet from '../mockServer/OrderHeaderSet.json';
import CheckListSet from '../mockServer/CheckListSet.json';
import StandardTextSet from '../mockServer/StandardTextSet.json';
import WorkCenterSet from '../mockServer/WorkCenterSet.json';
import EmployeeSet from '../mockServer/EmployeeSet.json';
import ActTypeSet from '../mockServer/ActTypeSet.json';
import OrderOperationChecklistToolSet from '../mockServer/OrderOperationChecklistToolSet.json';
import OrderOperationChecklistPartSet from '../mockServer/OrderOperationChecklistPartSet.json';
import OrderOperationChecklistCalbSet from '../mockServer/OrderOperationChecklistCalbSet.json';
import OrderOperationChecklistTaskSet from '../mockServer/OrderOperationChecklistTaskSet.json';
import MaterialSet from '../mockServer/MaterialSet.json';
import { NetworkService, ConnectionStatus } from './network.service';
import { MatSnackBar } from '@angular/material';
import OrderConfirmationSet  from '../mockServer/OrderConfirmationSet.json';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor(private networkService: NetworkService,public snackBar: MatSnackBar) { }

  getAllMockNotifs(codePlant) {
    let notifList = NotifHeaderdata;
    return notifList.filter(
      (notif:any) =>{
        return notif.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      })
  }

  getAllMockPlants(forceRefresh: boolean = false){
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      this.openSnackBar('OFFLINE MODE');
    }
    else{
      this.openSnackBar('ONLINE MODE');
    }
    return Plantdata;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  getAllMockSOP(codePlant){
    let SOPList = SOP;
    return SOPList.filter(
      (sop) =>{
        return (sop.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1
             && sop.InProcess == false);
      }
    )
  }

  getAllMockSO(codePlant){
    let SOPList = SOP;
    return SOPList.filter(
      (sop) =>{
        return (sop.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1
             && sop.InProcess == true);
      }
    )
  }

  getAllMyMockSO(codePlant){
    let SOPList = SOP;
    return SOPList.filter(
      (sop) =>{
        return (sop.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1
             && sop.Mine == true);
      }
    )
  }

  getMockNotifByNumber(notifNo: string){
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
        return op.OrderNo.toLowerCase() === orderNo.toLowerCase();
      }
    )
  }

  getMockOrderConfirmations(orderNo: string,operationNo: string,codePlant: string){
    let orderConfirmations = OrderConfirmationSet;
    return orderConfirmations.filter(
      (or) =>{
        return or.Activity.toLowerCase() === operationNo.toLowerCase() && 
        or.OrderNo.toLowerCase() === orderNo.toLowerCase() &&
        or.PlanPlant.toLowerCase() === codePlant.toLowerCase()
      }
    )
  }

  getMockOrderOpChckToolSetByOrderNo(orderNo: string,codePlant: string,operation: string){
    let ordOpChckToolSet = OrderOperationChecklistToolSet;
    return ordOpChckToolSet.filter(
      (oct) =>{
        return (oct.OrderNo.toLowerCase() === orderNo.toLowerCase() && oct.Plant === codePlant 
                && oct.Activity.toLowerCase() === operation.toLowerCase());
      }
    ) 
  }

  getMockOrderOperationChecklistPartSet(orderNo: string,codePlant: string,operation: string){
    let ordOpChckPartSet = OrderOperationChecklistPartSet;
    return ordOpChckPartSet.filter(
      (ocp) =>{
        return (ocp.OrderNo.toLowerCase() === orderNo.toLowerCase()
                && ocp.Plant === codePlant && ocp.Activity.toLowerCase() === operation.toLowerCase());
      }
    ) 
  }

  getMockMaterialFromPlant(codePlant: string){
    return MaterialSet.filter(
      (mat) =>{
        return mat.Plant.toLowerCase() === codePlant.toLowerCase()
      }
    )
  }

  getMockOrderOperationChecklistCalbSet(orderNo: string,codePlant: string,operation: string){
    let ordOpChckCalbSet = OrderOperationChecklistCalbSet;
    return ordOpChckCalbSet.filter(
      (occ) =>{
        return (occ.OrderNo.toLowerCase() === orderNo.toLowerCase()
                && occ.Plant === codePlant && occ.Activity.toLowerCase() === operation.toLowerCase());
      }
    ) 
  }

  getMockOrderOperationChecklistTaskSet(orderNo: string,codePlant: string,operation: string){
    let ordOpChckTaskSet = OrderOperationChecklistTaskSet;
    return ordOpChckTaskSet.filter(
      (oct) =>{
        return (oct.OrderNo.toLowerCase() === orderNo.toLowerCase()
                && oct.Plant === codePlant && oct.Activity.toLowerCase() === operation.toLowerCase());
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

  getMockOrderComponentsByActivity(orderNo: string,activity: string,codePlant: string){
    let components = Ordercomponents;
    return components.filter(
      (cp) =>{
        if(cp.OrderNo != null && orderNo != null){
          return (cp.OrderNo.toLowerCase() === orderNo.toLowerCase() &&
                  cp.Activity.toLowerCase() === activity.toLowerCase() &&
                  cp.PlanPlant.toLowerCase() === codePlant.toLowerCase()
          );
        }
      }
    )
  }

  getMockOrderByPlant(codePlant){
    return OrderHeaderSet.filter(
      (ord) =>{
        return ord.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      }
    )
  }

  getMockFunctLocsByPlant(codePlant){
    let functLocs = FunctLocs;
    return functLocs.filter(
      (fl) =>{
        return fl.PlanPlant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      }
    )
  }

  getMockFunctLocsByPlantAndFirstLevelFLOC(codePlant,firstLevelFLOC){
    let functLocs = FunctLocs;
    return functLocs.filter(
      (fl) =>{
        return (fl.PlanPlant.toLowerCase() === codePlant.toLowerCase()
              && fl.SupFunctLoc.toLowerCase() === firstLevelFLOC.toLowerCase());
      }
    )
  }

  getMockPriorities(){
    return Priorities;
  }

  getMockEffects(){
    return Effects;
  }

  getMockequipments(functLoc){
    return EquipmentSet.filter(
      (eq) =>{
        return eq.FunctLoc.toLowerCase().indexOf(functLoc.toLowerCase()) > -1;
      }
    )
  }

  
  getMockCG(){
    return CauseGroupSet;
  }

  getMockCC(causeGroup){
    return CauseCodeSet.filter(
      (cc: any) =>{
        return cc.CodeGroup.toLowerCase().indexOf(causeGroup.toLowerCase()) > -1;
      }
    )
  }

  getMockDamageGroups(){
    return DamageGroupSet;
  }

  getMockDamageCodes(damageGroup){
    return DamageCodeSet.filter(
      (dc: any) =>{
        return dc.CodeGroup.toLowerCase().indexOf(damageGroup.toLowerCase()) > -1;
      });
  }

  getObjectPartGroups(){
    return ObjectPartGroupSet;
  }

  getObjectPartCodes(opGroup){
    return ObjectPartCodeSet.filter(
      (oc: any) =>{
        return oc.CodeGroup.toLowerCase().indexOf(opGroup.toLowerCase()) > -1;
      });
  }

  getMockCheckListByPlant(codePlant){
    return CheckListSet.filter(
      (ck) =>{
        return ck.Plant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      }
    )
  }

  getMockStandardTextsSet(){
    return StandardTextSet;
  }

  getMockWorkCentersByPlant(codePlant){
    return WorkCenterSet.filter(
      (wc) =>{
        return wc.Plant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1;
      })
  }

  getMockEmployees(){
    return EmployeeSet;
  }

  getMockActTypes(codePlant,workCenter){
    console.log("codePlant: ",codePlant," workCenter: ",workCenter);
    return ActTypeSet.filter(
      (at) =>{
        return (at.Plant.toLowerCase().indexOf(codePlant.toLowerCase()) > -1
            && at.WorkCenter.toLowerCase().indexOf(workCenter.toLowerCase()) > -1)
      })
  }

}
