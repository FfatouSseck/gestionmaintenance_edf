import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActTypeService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
   }

   getAllActTypesByPlantAndWorkCenter(codePlant,workCenter){
     return this.getAll("ActTypeSet?$filter=Plant eq '"+codePlant+"' and WorkCenter eq '"+workCenter+"'");
   }
}
