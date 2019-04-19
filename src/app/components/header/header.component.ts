import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { DetailsSettingsPage } from 'src/app/pages/details-settings/details-settings.page';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    modal: any;
    currentUrl = "";
    currentPlant = "";
    currentPlantDescr = "";
    plant = "";
    syncPlant = "";
    syncPlantDescr = "";
    @Input() pageTitle: string;
    @Output() close: EventEmitter<any> = new EventEmitter();

    constructor(private actionSheetController: ActionSheetController,
        private modalController: ModalController, private router: Router,
        private storage: Storage) { }

    ngOnInit() {
        this.init();
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
        if (data != undefined) {
            if(data.result.length>0){
                this.init();
            }
            console.log("data", data);
        }
    }

    init(){
        this.currentUrl = this.router.url;
        this.storage.get("choosenPlant").then(
            (plant) => {
                console.log("plant: ", plant);
                if (plant != null && plant != undefined && plant !== "") {
                    this.plant = plant;
                    if (this.plant !== "") {
                        this.currentPlant = this.plant;
                    }
                    this.storage.get("choosenPlantDescr").then(
                        (currentPlantDescr) => {
                            if (currentPlantDescr != "" && currentPlantDescr != undefined && currentPlantDescr != null) {
                                this.currentPlantDescr = currentPlantDescr;
                            }
                        }
                    )
                }
            }
        )
        this.storage.get("syncPlant").then(
            (syncPlant) => {
                console.log("syncPlant: ", syncPlant);
                if (syncPlant != null && syncPlant != undefined && syncPlant !== "") {
                    this.syncPlant = syncPlant;
                }
                this.storage.get("syncPlantDescr").then(
                    (syncPlantDescr) => {
                        if (syncPlantDescr != "" && syncPlantDescr != undefined && syncPlantDescr != null) {
                            this.syncPlantDescr = syncPlantDescr;
                        }
                    }
                )
            }
        )
    }

    async presentActionSheet() {//display user settings and plant options

        this.init();
        const actionSheet = await this.actionSheetController.create({
            header: 'Options',
            buttons: [
                {
                    text: this.currentPlant === "" ? 'Choose Plant' : this.currentPlant,
                    icon: 'send',
                    handler: () => {
                        this.presentPlantsModal();
                    }
                },
                {
                    text: this.syncPlant === "" ? '' : this.syncPlant,
                    icon: 'sync',
                    handler: () => {
                        if (this.syncPlant !== "") {
                            let interm = this.syncPlant;
                            let intermDescr = this.syncPlantDescr;

                            this.syncPlant = this.currentPlant;
                            this.currentPlant = interm;
                            this.plant = this.currentPlant ;
                            this.syncPlantDescr = this.currentPlantDescr;
                            this.currentPlantDescr = intermDescr;

                            this.storage.set("choosenPlant", this.currentPlant);
                            this.storage.set("syncPlant", this.syncPlant);
                            this.storage.set("choosenPlantDescr", this.currentPlantDescr);
                            this.storage.set("syncPlantDescr", this.syncPlantDescr);
                            let data = {
                                result: {
                                    choosenPlant: this.currentPlant,
                                    syncPlant: this.syncPlant,
                                    choosenPlantDescr: this.currentPlantDescr,
                                    syncPlantDescr: this.syncPlantDescr
                                }
                            }
                            this.close.emit(data);
                        }
                    }
                },
                {
                    text: 'User settings',
                    icon: 'person',
                    handler: () => {
                    }
                },
                {
                    text: 'Logout',
                    icon: 'power',
                    handler: () => {
                        this.storage.remove("choosenPlant")
                            .then(
                                () => {
                                    this.storage.remove("mock").then(
                                        () => {
                                            this.router.navigateByUrl("/login");
                                        }
                                    )
                                })
                            .catch(
                                () => {
                                    this.router.navigateByUrl("/login");
                                })
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
