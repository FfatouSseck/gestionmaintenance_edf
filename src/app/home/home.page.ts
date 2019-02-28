import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsSettingsPage } from '../pages/details-settings/details-settings.page';
import { ActionSheetController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  orientation = "portrait_primary";
  constructor(public actionSheetController: ActionSheetController,
              public modalController: ModalController,private screenOrientation: ScreenOrientation)
    {
      this.orientation = this.screenOrientation.type;
      console.log(this.orientation);
        // detect orientation changes
        this.screenOrientation.onChange().subscribe(
          () => {
              this.orientation = this.screenOrientation.type;
              console.log(this.orientation);
          }
        );
    }

  async presentPlantsModal(){
    const modal = await this.modalController.create({
      component: DetailsSettingsPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  async presentActionSheet() {//display user settings and plant options
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{
        text: 'Choose Plant',
        icon: 'send',
        handler: () => {
          console.log('choose plant clicked');
          this.presentPlantsModal();
        }
      }, {
        text: 'User settings',
        icon: 'settings',
        handler: () => {
          console.log('user settings clicked');
        }
      },/* {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      },*/ {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

    
  
  
}
