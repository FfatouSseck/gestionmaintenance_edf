import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { Notification } from '../interfaces/notification.interface';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService{

  headers = new HttpHeaders();
  notifs:Notification[] = [];
  available = false;
  currentNotif: any;

  constructor(public http: HttpClient) { 
    super(http);
    this.headers.append("Accept","application/json");
    this.headers.append("Content-Type","application/json");
  }

  getAllNotifs(codePlant){
    return this.getAll("NotifHeaderSet?$filter=PlanPlant eq '"+codePlant+"'");
  }

  updateNotif(notifNnumber: string,notifUpdated: any){
    let hd = this.headers;
    hd.append('X-CSRF-Token','Fetch');
    return this.http.put(`${environment.apiUrl}`+"NotifHeaderSet('"+notifNnumber+"')",
                          notifUpdated,{headers:hd})
                          .pipe(
                            catchError(this.handleError)
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
