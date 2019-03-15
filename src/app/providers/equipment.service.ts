import { Injectable } from '@angular/core';
import {of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { BaseService } from './base.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends BaseService{

  available = false;
  equipmentList: any[] = [];

  constructor(public http: HttpClient) { 
    super(http)
  }

  getAllEquipmentsByFunctLoc(codeFunctLoc): Observable<any> {
    console.log(codeFunctLoc)
    return this.getAll("/EquipmentSet?$filter=FunctLoc eq '"+codeFunctLoc+"'");
  }

  setEquipments(equipments) {
    this.available = false;
    console.log(equipments);
    if (equipments.length > 0) {
      this.equipmentList = equipments;
      this.available = true;
    }
  }

  checkAvailability() {
    return this.available;
  }

  getAvailableEquipments() {
    return this.equipmentList;
  }

  filterItems(searchTerm) {
    return this.equipmentList.filter((eq) => {
      return (eq.EquipmentId.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || eq.EquipmentDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
    });
  }
 
}
