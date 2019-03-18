import { Injectable } from '@angular/core';
import { DamageCode } from '../interfaces/damagecode.interface';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DamagecodeService extends BaseService{
  available = false;
  damageCodeList: DamageCode[] = [];

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllDamageCodesByGroup(codeGroup) {
    return this.getAll("DamageCodeSet?$filter=CodeGroup eq '"+codeGroup+"'");
  }

  setDamageCodes(damageCodeList) {
    if (damageCodeList.length > 0) {
      this.damageCodeList = damageCodeList;
      this.available = true;
    }
  }


  checkAvailability() {
    return this.available;
  }

  getAvailableDamageCodes() {
    return this.damageCodeList;
  }

  filterItems(searchTerm) {

    return this.damageCodeList.filter((oc) => {
      return (oc.CodeDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || oc.CodeGroup.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || oc.CatalogProfile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || oc.Code.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });

  }
}
