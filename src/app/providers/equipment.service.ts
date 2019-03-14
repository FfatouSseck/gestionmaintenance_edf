import { Injectable } from '@angular/core';
import {of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getAllEquipmentsByFunctLoc(codeFunctLoc): Observable<any> {
    return this.http.get(`${environment.apiUrl}`+"/EquipmentSet?$filter=FunctLoc eq '"+codeFunctLoc+"'", httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  
  getEquipmentById(id: string): Observable<any> {
    const url = `${environment.apiUrl}/Equipment/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  
  postEquipment(data): Observable<any> {
    const url = `${environment.apiUrl}/Equipment/`;
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  updateEquipment(id: string, data): Observable<any> {
    const url = `${environment.apiUrl}/Equipment/${id}`;
    return this.http.put(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  deleteEquipment(id: string): Observable<{}> {
    const url = `${environment.apiUrl}/Equipment/${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
