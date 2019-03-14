import { Injectable } from '@angular/core';
import { CauseCode } from '../interfaces/causecode.interface';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CausecodeService extends BaseService {

  available = false;
  causecodesList: CauseCode[] = [];

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllCauseCodesByGroup(codeGroup) {
    return this.getAll("/CauseCodeSet?$filter=CodeGroup eq '"+codeGroup+"'");
  }

  setCauseCodes(causecodes) {
    if (causecodes.length > 0) {
      this.causecodesList = causecodes;
      this.available = true;
    }
  }

  checkAvailability() {
    return this.available;
  }

  getAvailableCausecodes() {
    return this.causecodesList;
  }

  filterItems(searchTerm) {

    return this.causecodesList.filter((cg) => {
      return (cg.CodeDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || cg.CodeGroup.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || cg.CatalogProfile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || cg.Code.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });
  }
}
