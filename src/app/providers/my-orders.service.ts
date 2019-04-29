import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyOrdersService extends BaseService {
  mySOs: any[] = [];
  available = false;
  myCurrentSO: any;

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllMySOsByChoosenPlant(codePlant) {
    return this.getAll("OrderHeaderSet?$filter=PlanPlant eq '" + codePlant + "' and Mine eq true");
  }

  setSOs(SOs) {
    let done = false;
    if (SOs.length > 0) {
      this.mySOs = SOs;
      done = true;
      this.available = true;
    }
    else this.available = false;

    return done;
  }

  setMyCurrentSO(mySO) {
    this.myCurrentSO = mySO;
  }

  getMySOs() {
    return this.mySOs;
  }

  filterMySOs(searchTerm) {
    return this.mySOs.filter(
      ord => {
        return (ord.OrderNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || ord.StatusDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || ord.FunctLoc.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
      }
    )
  }
}
