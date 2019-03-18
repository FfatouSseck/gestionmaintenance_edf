import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { DamageGroup } from '../interfaces/damagegroup.interface';

@Injectable({
  providedIn: 'root'
})
export class DamagegroupService extends BaseService {
  available = false;
  damageGroupList: DamageGroup[] = [];

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllDamageGroups() {
    return this.getAll('DamageGroupSet');
  }

  setDamageGroups(objectPartGroups) {
    if (objectPartGroups.length > 0) {
      this.damageGroupList = objectPartGroups;
      this.available = true;
    }
  }


  checkAvailability() {
    return this.available;
  }

  getAvailableDamageGroups() {
    return this.damageGroupList;
  }

  filterItems(searchTerm) {

    return this.damageGroupList.filter((dg) => {
      return (dg.CodeDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || dg.CodeGroup.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || dg.CatalogProfile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });

  }
}
