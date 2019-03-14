import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { CauseGroup } from '../interfaces/causegroup.interface';

@Injectable({
  providedIn: 'root'
})
export class CausegroupService extends BaseService {

  available = false;
  causegroupsList: CauseGroup[] = [];

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllCauseGroups() {
    return this.getAll('CauseGroupSet');
  }

  setCauseGroups(causegroups) {
    if (causegroups.length > 0) {
      this.causegroupsList = causegroups;
      this.available = true;
    }
  }


  checkAvailability() {
    return this.available;
  }

  getAvailableCausegroups() {
    return this.causegroupsList;
  }

  filterItems(searchTerm) {

    return this.causegroupsList.filter((cg) => {
      return (cg.CodeDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || cg.CodeGroup.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || cg.CatalogProfile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });

  }
}
