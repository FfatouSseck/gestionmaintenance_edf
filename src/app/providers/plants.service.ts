import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PlantsService extends BaseService {
  headers = new HttpHeaders();

  constructor(public http: HttpClient) { 
    super(http);
    this.headers.append("Accept","application/json");
    this.headers.append("Content-Type","application/json");

  }

  getAllPlants(){
    return this.getAll('PlanPlantSet');
  }
}
