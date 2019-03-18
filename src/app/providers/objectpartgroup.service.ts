import { Injectable } from '@angular/core';
import { ObjectPartGroup } from '../interfaces/objectpartgroup.interface';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObjectpartgroupService extends BaseService {
  available = false;
  objectPartGroupList: ObjectPartGroup[] = [];

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllObjectPartGroups() {
    return this.getAll('ObjectPartGroupSet');
  }

  setObjectPartGroups(objectPartGroups) {
    if (objectPartGroups.length > 0) {
      this.objectPartGroupList = objectPartGroups;
      this.available = true;
    }
  }


  checkAvailability() {
    return this.available;
  }

  getAvailableObjectPartGroups() {
    return this.objectPartGroupList;
  }

  filterItems(searchTerm) {

    return this.objectPartGroupList.filter((og) => {
      return (og.CodeDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || og.CodeGroup.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || og.CatalogProfile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });

  }
}
