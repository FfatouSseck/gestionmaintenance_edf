import { Injectable } from '@angular/core';
import { ObjectPartCode } from '../interfaces/objectpartcode.interface';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObjectpartcodeService extends BaseService {
  available = false;
  objectPartCodeList: ObjectPartCode[] = [];

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllObjectPartCodesByGroup(codeGroup) {
    return this.getAll("ObjectPartCodeSet?$filter=CodeGroup eq '"+codeGroup+"'");
  }

  setObjectPartCodes(objectPartCodeList) {
    if (objectPartCodeList.length > 0) {
      this.objectPartCodeList = objectPartCodeList;
      this.available = true;
    }
  }


  checkAvailability() {
    return this.available;
  }

  getAvailableObjectPartCodes() {
    return this.objectPartCodeList;
  }

  filterItems(searchTerm) {

    return this.objectPartCodeList.filter((oc) => {
      return (oc.CodeDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || oc.CodeGroup.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || oc.CatalogProfile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || oc.Code.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });

  }
}
