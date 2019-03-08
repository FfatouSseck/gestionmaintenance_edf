import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs/internal/Observable';
import { Priority } from '../interfaces/priority.interface';


@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  headers = new HttpHeaders();
  available = false;
  prioritiesList:Priority[] = [];

  constructor(public http: HttpClient) { 
    this.headers.append("Accept","application/json");
    this.headers.append("Content-Type","application/json");
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getAllPriorities() : Observable<any>{
    return this.http.get(`${environment.apiUrl}`+'PrioritySet',{headers:this.headers,responseType:'json'}).pipe(
      map(this.extractData)
    );
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
