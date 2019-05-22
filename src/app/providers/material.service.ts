import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaterialService extends BaseService {

  constructor(public http: HttpClient) { 
    super(http);
  }

  getMaterialByPlant(codePlant: string){
    return this.getAll("MaterialSet?$filter= Plant eq '"+codePlant+"'");
  }
}
