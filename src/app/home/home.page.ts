import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsSettingsPage } from '../pages/details-settings/details-settings.page';
import { ActionSheetController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { MatSnackBar } from '@angular/material';
import { Storage } from '@ionic/storage';
import { PlantsService } from '../providers/plants.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  orientation = "portrait_primary";
  choosenPlant = "";

  constructor(public actionSheetController: ActionSheetController,public storage: Storage,
              public snackBar: MatSnackBar,public modalController: ModalController,
              private screenOrientation: ScreenOrientation,public plantService: PlantsService)
    {

      this.plantService.getAllPlants().subscribe(
        (plants) =>{
          console.log("List of plants",plants)
        },
        (err) =>{
          console.log("Erreur",err);
        }
      )
      this.orientation = this.screenOrientation.type;
        // detect orientation changes
        this.screenOrientation.onChange().subscribe(
          () => {
              this.orientation = this.screenOrientation.type;
          }
        );
        //we check if there is a choosen plant
        this.storage.get("choosenPlant").then(
          (choosenPlantcode) =>{
              if(choosenPlantcode != null){
                this.choosenPlant = choosenPlantcode;
              }
              //otherwise we ask the user to choose a plant
              else this.presentPlantsModal();
          },
          (err) =>{
            console.log("error",err);
          })
    }

    //list available plants
  async presentPlantsModal(){
    const modal = await this.modalController.create({
      component: DetailsSettingsPage,
      componentProps: { },
    });
    modal.backdropDismiss = false;
    return await modal.present();
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
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
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

    
  
  
}
