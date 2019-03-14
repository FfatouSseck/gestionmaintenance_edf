import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ProductionEffect } from '../interfaces/effect.interface';

@Injectable({
  providedIn: 'root'
})
export class EffectService extends BaseService {

  effectsList:ProductionEffect[] = [];
  available = false;

  constructor(public http: HttpClient) {
    super(http);
   }

   getAllEffects(){
    return this.getAll('EffectSet');
   }

   setEffects(effects){
    if(effects.length>0){
      this.effectsList = effects;
      this.available = true;
    }
   }

   checkAvailability(){
    return this.available;
  }

  getEffects(){
    return this.effectsList;
  }

}
