import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.page.html',
  styleUrls: ['./notification-details.page.scss'],
})
export class NotificationDetailsPage implements OnInit {
  
  @Input() code: number;
  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
  }

  closeModal()
  {
    this.modalCtrl.dismiss();
  }

}
