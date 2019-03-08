import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs/internal/Observable';
import { Notification } from '../interfaces/notification.interface';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  headers = new HttpHeaders();
  notifs:Notification[] = [];
  available = false;
  currentNotif: any;

  constructor(public http: HttpClient) { 
    this.headers.append("Accept","application/json");
    this.headers.append("Content-Type","application/json");
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getAllNotifs(codePlant){
    return this.http.get(`${environment.apiUrl}`+"NotifHeaderSet?$filter=PlanPlant eq '"+codePlant+"'",{headers:this.headers,responseType:'json'}).pipe(
      map(this.extractData)
    );
  }

  setNotifs(ntfs): boolean{
    let done = false;
    
    if(ntfs.length>0){
      for(let i=0;i<ntfs.length;i++){
        this.notifs.push({
          breakdownIndic: ntfs[i].Breakdown,
          cause: ntfs[i].CauseCode+" "+ntfs[i].CauseDescr,
          color: null,
          damageCode:ntfs[i].DamageCode,
          description:ntfs[i].ShortText,
          equipment:ntfs[i].Equipment,
          functloc:ntfs[i].FunctLoc+" "+ntfs[i].FunctLocDescr,
          longText:ntfs[i].LongText,
          notifNumber:ntfs[i].NotifNo,
          objectPart:ntfs[i].ObjectPartCode+" "+ntfs[i].ObjectPartCodeDescr,
          priority:ntfs[i].PriorityDescr,
          productionEff:ntfs[i].EffectDescr,
          startDate: ntfs[i].StartDate
        });
      }

      done=true;
      this.available = true;
    }
    else this.available = false;
    
    return done;
  }

  notifsAvailable():boolean{
    return this.available;
  }

  filterNotifs(searchTerm){
    return this.notifs.filter((notif) => {
        return (notif.notifNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || notif.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
    });     
 }

 setCurrentNotif(notif){
   this.currentNotif = notif;
 }

 getCurrentNotif(){
   return this.currentNotif;
 }

}
