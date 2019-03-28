import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { NotifHeader } from '../interfaces/notification.interface';
import { BaseService } from './base.service';
import { Storage } from '@ionic/storage';



@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {

  headers = new HttpHeaders();
  notifs: NotifHeader[] = [];
  available = false;
  currentNotif: any;

  constructor(public http: HttpClient, private storage: Storage) {
    super(http);
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
  }

  getAllNotifs(codePlant) {
    return this.getAll("NotifHeaderSet?$filter=PlanPlant eq '" + codePlant + "'");
  }

  getNotifByNumber(notifNo) {
    return this.getAll("NotifHeaderSet('" + notifNo + "')");
  }

  updateNotif(notifNnumber: string, notifUpdated: any) {
    let hd = this.headers;
    this.storage.get("auth_token").then(
      (token) => {
        console.log('Basic ' + token);
        if (token != null && token != undefined) {
          console.log('Basic ' + token);
          hd.append("Authorization", 'Basic ' + token);
          hd.append('X-CSRF-Token', 'Fetch');

        }
      }, (err) => {
        console.log(err);
      }
    )

    return this.http.put(`${environment.apiUrl}` + "NotifHeaderSet('" + notifNnumber + "')",
      notifUpdated, { headers: hd })
      .pipe(
        catchError(this.handleError)
      );

  }

  setNotifs(ntfs): boolean {
    let done = false;

    if (ntfs.length > 0) {
      this.notifs = ntfs;

      done = true;
      this.available = true;
    }
    else this.available = false;

    return done;
  }

  getAvailableNotifs() {
    return this.notifs;
  }

  notifsAvailable(): boolean {
    return this.available;
  }

  filterNotifsByFLOC(floc: string) {
    return this.notifs.filter(
      (notif) => {
        return notif.FunctLoc.toLowerCase().indexOf(floc.toLowerCase()) > -1;
      }
    )
  }

  filterNotifs(searchTerm) {
    return this.notifs.filter((notif) => {
      return (notif.NotifNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || notif.ShortText.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    });
  }

  setCurrentNotif(notif) {
    this.currentNotif = notif;
  }

  getCurrentNotif() {
    return this.currentNotif;
  }

}
