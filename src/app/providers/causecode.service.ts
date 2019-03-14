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

  getAllCauseCodes() {
    return this.getAll('CauseCodeSet');
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
}
