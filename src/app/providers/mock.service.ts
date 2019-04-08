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

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor() { }

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

}
