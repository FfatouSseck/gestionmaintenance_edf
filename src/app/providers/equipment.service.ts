import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.getAll("/EquipmentSet?$filter=FunctLoc eq '"+codeFunctLoc+"'");
  }

  setEquipments(equipments) {
    this.available = false;
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
