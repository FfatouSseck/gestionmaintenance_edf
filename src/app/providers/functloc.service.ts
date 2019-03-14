import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FunctlocService extends BaseService {

  available = false;
  functLocsList: any[] = [];
  
  constructor(public http: HttpClient) {
    super(http);
   }

  
  getAllFunctLocByPlant(codePlant): Observable<any> {
    return this.getAll("/FunctLocSet?$filter=PlanPlant eq '"+codePlant+"'");
  }

  setFunctLocs(FunctLocs) {
    if (FunctLocs.length > 0) {
      this.functLocsList = FunctLocs;
      this.available = true;
    }
  }

  checkAvailability() {
    return this.available;
  }

  getAvailableFunctLocs() {
    return this.functLocsList;
  }

  filterItems(searchTerm) {
    return this.functLocsList.filter((fl) => {
      return (fl.FunctLocId.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || fl.FunctLocDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
    });
  }

}
