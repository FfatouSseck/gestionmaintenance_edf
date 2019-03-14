import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { Priority } from '../interfaces/priority.interface';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class PriorityService extends BaseService {
  headers = new HttpHeaders();
  available = false;
  prioritiesList:Priority[] = [];

  constructor(public http: HttpClient) { 
    super(http);
    this.headers.append("Accept","application/json");
    this.headers.append("Content-Type","application/json");
  }

  getAllPriorities() : Observable<any>{
    return this.getAll('PrioritySet');
  }

  setPriorities(priorities){
    if(priorities.length>0){
      this.prioritiesList = priorities;
      this.available = true;
    }
      
  }

  checkAvailability(){
    return this.available;
  }

  getPriorities(){
    return this.prioritiesList;
  }
}
