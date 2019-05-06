import { Injectable } from '@angular/core';
import {of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { Storage } from '@ionic/storage';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(public http: HttpClient) { }

  public handleError(error: HttpErrorResponse) {
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
    return throwError('Error');
  }

  public extractData(res: Response) {
    let body = res;
    return body || { };
  }

  public getAll(defSet:string): Observable<any> {
    return this.http.get(`${environment.apiUrl}`+defSet, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  post(data,defSet:string): Observable<any> {
    const url = `${environment.apiUrl}`+defSet;
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  update(id: string, data,defSet:string): Observable<any> {
    const url = `${environment.apiUrl}`+defSet+`/${id}`;
    return this.http.put(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  delete(id: string,defSet:string): Observable<{}> {
    const url = `${environment.apiUrl}`+defSet+`/${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

}
