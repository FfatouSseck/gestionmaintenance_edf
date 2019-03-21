import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { DetailsSettingsPage } from 'src/app/pages/details-settings/details-settings.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  modal: any;
  currentUrl = "";
  @Input() pageTitle: string;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private actionSheetController: ActionSheetController, 
              private modalController: ModalController,private router: Router) { }

    ngOnInit() {
      this.currentUrl = this.router.url;
    }

    //list available plants
    async presentPlantsModal() {
        this.modal = await this.modalController.create({
            component: DetailsSettingsPage,
            componentProps: {},
        });
        this.modal.backdropDismiss = false;
        await this.modal.present();

        const { data } = await this.modal.onDidDismiss();
        this.close.emit(data);
    }

    async presentActionSheet() {//display user settings and plant options
        const actionSheet = await this.actionSheetController.create({
            header: 'Options',
            buttons: [{
                text: 'Choose Plant',
                icon: 'send',
                handler: () => {
                    this.presentPlantsModal();
                }
            },
            {
                text: 'User settings',
                icon: 'settings',
                handler: () => {
                }
            },
            {
                text: 'Logout',
                icon: 'power',
                handler: () => {
                    this.router.navigateByUrl("/login")
                }
            },
            {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel'
            }]
        });
        await actionSheet.present();
    }

}
