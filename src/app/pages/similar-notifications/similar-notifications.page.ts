import { Component, OnInit } from '@angular/core';
import { NotifHeader } from 'src/app/interfaces/notification.interface';
import { NotificationService } from 'src/app/providers/notification.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-similar-notifications',
  templateUrl: './similar-notifications.page.html',
  styleUrls: ['./similar-notifications.page.scss'],
})
export class SimilarNotificationsPage implements OnInit {
  similarNotifs:any;
  displayedColumns = ['NotifNo','Description',
    'Floc','Priority','CreatedBy', 'CreatedDate','button']

  constructor(private notifService: NotificationService, private router: Router) { 
    let choosenNotif: NotifHeader = this.notifService.getCurrentNotif();
    this.similarNotifs = new MatTableDataSource(this.notifService.filterNotifsByFLOC(choosenNotif.FunctLoc));
  }

  ngOnInit() {
  }

  getDetails(element){
    console.log(element);
  }

  
  formatDate(newD: string) {

    let d1 = newD.replace('/Date(', '');
    let startDate = d1.replace(')/', '');
    let newDate = new Date(Number(startDate));

    let m = newDate.getMonth() + 1;
    let d = newDate.getDate();
    let month = "";
    let day = "";

    if (m.toString().length < 2) {
      month = "0" + m;
    } else month = m.toString();

    if (d.toString().length < 2) {
      day = "0" + d;
    } else day = d.toString();

    let datec = day + "/" + month + "/" + newDate.getFullYear();
    return datec

  }

  getHoursandMinutes(d) {
    let d1 = d.replace('/Date(', '');
    let startDate = d1.replace(')/', '');
    let newDate = new Date(Number(startDate));

    let min = newDate.getMinutes();
    let h = newDate.getHours();
    let minutes = "";
    let hours = "";

    if (min.toString().length < 2) {
      minutes = "0" + min;
    } else minutes = min.toString();

    if (h.toString().length < 2) {
      hours = "0" + h;
    } else hours = h.toString();

    let dateD = this.formatDate(d) + " " + hours + ":" + minutes;
    return dateD;
  }

}
