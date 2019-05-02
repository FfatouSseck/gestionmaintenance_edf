import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { BaseService } from './base.service';
import { map, tap } from 'rxjs/operators';
import { NetworkService, ConnectionStatus } from './network.service';
import { OfflineManagerService } from './offline-manager.service';
import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PlantsService extends BaseService {
  headers = new HttpHeaders();

  constructor(public http: HttpClient,private networkService: NetworkService,private offlineManager: OfflineManagerService,
              private storage: Storage) { 

    super(http);
    this.headers.append("Accept","application/json");
    this.headers.append("Content-Type","application/json");

  }

  getAllPlants(forceRefresh: boolean = false){
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      return from(this.getStoredPlants());
    }
    else {
     // return this.getAll('PlanPlantSet')

       return this.getAll('PlanPlantSet').pipe(
        map(res => res['data']),
        tap(res => {
          this.storage.set('storedPlants', res);
        })
      )
    }
  }

  getVpn(){
    return this.http.get("https://vpn.edf-re.com/EDF-Connection",{headers:this.headers,responseType:'json'}).pipe(
      map(this.extractData)
    );
  }

  // Get cached API result
  private getStoredPlants() {
    return this.storage.get("storedPlants");
  }
}
