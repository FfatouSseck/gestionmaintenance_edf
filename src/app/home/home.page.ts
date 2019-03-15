import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsSettingsPage } from '../pages/details-settings/details-settings.page';
import { ActionSheetController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { MatSnackBar } from '@angular/material';
import { Storage } from '@ionic/storage';
import { PlantsService } from '../providers/plants.service';
import { NotificationService } from '../providers/notification.service';
import { PriorityService } from '../providers/priority.service';
import { EffectService } from '../providers/effect.service';
import { CausegroupService } from '../providers/causegroup.service';
import { CausecodeService } from '../providers/causecode.service';
import { FunctlocService } from '../providers/functloc.service';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {



    orientation = "portrait-primary";
    choosenPlant = "";
    plants = [];
    modal: any;
    notifsCount = null;
    dataAvailable = false;

    constructor(public actionSheetController: ActionSheetController, public storage: Storage,
        public snackBar: MatSnackBar, public modalController: ModalController,
        private screenOrientation: ScreenOrientation, private plantService: PlantsService,
        private notifService: NotificationService, private priorityService: PriorityService,
        private effectService: EffectService, private causeCodeService: CausecodeService,
        private causeGroupService: CausegroupService, private functLocService: FunctlocService) {

        this.orientation = this.screenOrientation.type;
        // detect orientation changes
        this.screenOrientation.onChange().subscribe(
            () => {
                this.orientation = this.screenOrientation.type;
            }
        );

    }

    ngOnInit(): void {
        this.plantService.getAllPlants().subscribe(
            (plants) => {
                let plts = plants.d.results;
                this.plants = plts;
                //we check if there is a choosen plant
                this.storage.get("choosenPlant").then(
                    (choosenPlantcode) => {
                        if (choosenPlantcode != null) {
                            this.choosenPlant = choosenPlantcode;
                            this.getNotifList(this.choosenPlant);
                            //getting FunctLocSet from server
                            this.functLocService.getAllFunctLocByPlant(choosenPlantcode).subscribe(
                                (functlocs) => {
                                    this.functLocService.setFunctLocs(functlocs.d.results);
                                },
                                (err) => {
                                    console.log(err);
                                }
                            )
                        }
                        //otherwise we ask the user to choose a plant
                        else this.presentPlantsModal();
                    },
                    (err) => {
                        console.log("error", err);
                    })
            },
            (err) => {
                console.log("Erreur", err);
            }
        )


    }

    ionViewDidEnter() {
        //getting PrioritySet from server
        this.priorityService.getAllPriorities().subscribe(
            (priorities) => {
                this.priorityService.setPriorities(priorities.d.results);
            },
            (err) => {
                console.log(err);
            }
        )
        //getting EffectSet from server
        this.effectService.getAllEffects().subscribe(
            (effects) => {
                this.effectService.setEffects(effects.d.results);
            },
            (err) => {
                console.log(err);
            }
        )
        //getting CauseGroupSet from server
        this.causeGroupService.getAllCauseGroups().subscribe(
            (causegroups) => {
                this.causeGroupService.setCauseGroups(causegroups.d.results);
            },
            (err) => {
                console.log(err);
            }
        )

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
        this.getNotifList(data.result);
    }


    openSnackBar(message: string) {
        this.snackBar.open(message, null, {
            duration: 2000,
        });
    }

    onClose(evt: { result: string; }) {
        this.getNotifList(evt.result);
    }


    getNotifList(plant) {
        this.dataAvailable = false;
        this.notifService.getAllNotifs(plant).subscribe(
            (notifs: any) => {
                this.notifService.setNotifs(notifs.d.results);
                this.notifsCount = notifs.d.results.length;
                this.dataAvailable = true;
            }
        )
    }
}