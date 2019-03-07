import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {
  headers = new HttpHeaders();

  constructor(public http: HttpClient) { 
    this.headers.append("Accept","application/json");
    this.headers.append("Content-Type","application/json");
    this.headers.append("responseType","text")
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getAllPlants() : Observable<any>{
    return this.http.get(`${environment.apiUrl}`+'PlanPlantSet',{headers:this.headers,responseType:'json'}).pipe(
      map(this.extractData)
    );
  }
}
