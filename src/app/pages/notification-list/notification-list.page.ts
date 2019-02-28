import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { NotificationDetailsPage } from '../notification-details/notification-details.page';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
})
export class NotificationListPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async presentDetails(codeNotif: string) {
    const modal = await this.modalController.create({
      component: NotificationDetailsPage,
      componentProps: { code: codeNotif }
    });
    modal.backdropDismiss=true;
    return await modal.present();
  }

}
