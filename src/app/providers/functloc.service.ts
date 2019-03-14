import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { BaseService } from './base.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class FunctlocService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
   }

  
  getAllFunctLocByPlant(codePlant): Observable<any> {
    return this.getAll("/FunctLocSet?$filter=PlanPlant eq '"+codePlant+"'");
  }
  
  getFunctLocById(id: string): Observable<any> {
    const url = `${environment.apiUrl}/functloc/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  
  postFunctLoc(data): Observable<any> {
    const url = `${environment.apiUrl}/functloc/`;
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  updateFunctLoc(id: string, data): Observable<any> {
    const url = `${environment.apiUrl}/functloc/${id}`;
    return this.http.put(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  deleteFunctLoc(id: string): Observable<{}> {
    const url = `${environment.apiUrl}/functloc/${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
