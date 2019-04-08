import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkCenterService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
   }

   getWorkCentersByPlant(codePlant){
     return this.getAll("WorkCenterSet?$filter=Plant eq '"+codePlant+"'")
   }
}
