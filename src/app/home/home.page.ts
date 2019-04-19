import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
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
import { ServiceOrderPreparationService } from '../providers/service-order-preparation.service';
import { MockService } from '../providers/mock.service';
import { ServiceOrderService } from '../providers/service-order.service';
import { PlantListPage } from '../pages/plant-list/plant-list.page';


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
    ordersCount = null;
    soCount = null;
    dataAvailable = false;
    mock = false;

    constructor(public actionSheetController: ActionSheetController, public storage: Storage,
        public snackBar: MatSnackBar, public modalController: ModalController,
        private screenOrientation: ScreenOrientation, private plantService: PlantsService,
        private notifService: NotificationService, private priorityService: PriorityService,
        private effectService: EffectService, private causeCodeService: CausecodeService,
        private causeGroupService: CausegroupService, private soService: ServiceOrderService,
        public orderService: ServiceOrderPreparationService, private mockService: MockService,
        private platform: Platform) {

        this.orientation = this.screenOrientation.type;
        // detect orientation changes
        this.screenOrientation.onChange().subscribe(
            () => {
                this.orientation = this.screenOrientation.type;
            }
        );

    }

    ngOnInit(): void {
    }

    ionViewDidEnter() {

        this.ordersCount = null;
        this.soCount = null;
        this.dataAvailable = false;
        this.notifsCount = null;

        this.storage.get("mock").then(
            (mock) => {
                if (mock != undefined && mock != null) {
                    this.mock = mock;
                }

                if (this.mock) {
                    //we call the mock server
                    this.plants = this.mockService.getAllMockPlants();

                    //we check if there is a choosen plant
                    this.storage.get("choosenPlant").then(
                        (choosenPlantcode) => {
                            if (choosenPlantcode != null && choosenPlantcode != undefined && choosenPlantcode !== "") {
                                this.choosenPlant = choosenPlantcode;
                                let plants = [{ Plant: this.choosenPlant }]
                                this.updateData(plants);
                            }
                            //otherwise we ask the user to choose a plant
                            else {
                                this.presentPlantsModal();
                            }
                        },
                        (err) => {
                            console.log("error", err);
                        })
                }
                else {
                    this.plantService.getAllPlants().subscribe(
                        (plants) => {
                            let plts = plants.d.results;
                            this.plants = plts;
                            //we check if there is a choosen plant
                            this.storage.get("choosenPlant").then(
                                (choosenPlantcode) => {
                                    if (choosenPlantcode != null) {
                                        this.choosenPlant = choosenPlantcode;
                                        let plants = [{ Plant: this.choosenPlant }]
                                        this.updateData(plants);
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
                this.initialisation();
            }).finally(
                () => {
                }
            );

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
        if (data != undefined) {
            console.log("data", data);
        }
        this.updateData(data.result);
    }

    doRefresh(event) {
        console.log('Begin async operation');
        this.initialisation();

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 3000);
    }


    openSnackBar(message: string) {
        this.snackBar.open(message, null, {
            duration: 2000,
        });
    }

    onClose(evt) {
        console.log(evt, " is array: ", Array.isArray(evt.result));
        if (Array.isArray(evt.result)) {
            this.choosenPlant = evt.result[0].Plant;
        }
        else {
            this.choosenPlant = evt.result.choosenPlant;
        }

        this.initialisation();
    }


    updateData(plants) {
        this.ordersCount = null;
        this.soCount = null;
        this.dataAvailable = false;
        this.notifsCount = null;
        if (plants.length > 1) {
            this.choosenPlant = plants[1].Plant;
        }
        else if (plants.length == 1) {
            this.choosenPlant = plants[0].Plant;
        }

        if (this.mock != undefined && this.mock != null && this.mock == true) {
            this.getMockNotifs(this.choosenPlant);
        }
        else {
            this.notifService.getAllNotifs(this.choosenPlant).subscribe(
                (notifs: any) => {
                    this.notifService.setNotifs(notifs.d.results);
                    this.notifsCount = notifs.d.results.length;
                    this.dataAvailable = true;
                }
            )
        }

        //getting service order preparation
        this.storage.get("mock").then(
            (mock) => {
                if (mock != undefined && mock != null && mock == true) {
                    this.ordersCount = this.mockService.getAllMockSOP(this.choosenPlant).length;
                }
                else {
                    this.orderService.getAllOrdersByChoosenPlant(this.choosenPlant).subscribe(
                        (orders) => {
                            this.orderService.setOrders(orders.d.results);
                            this.ordersCount = orders.d.results.length;
                        }
                    )
                }
            });


        //getting service order process
        this.storage.get("mock").then(
            (mock) => {
                if (mock != undefined && mock != null && mock == true) {
                    this.soCount = this.mockService.getAllMockSO(this.choosenPlant).length;
                    console.log("soCount from mock: ", this.soCount);
                }
                else {//no mock
                    this.soService.getAllOrdersByChoosenPlant(this.choosenPlant).subscribe(
                        (ords) => {
                            this.soCount = ords.d.results.length;
                        }
                    )
                }
            })


    }

    getMockNotifs(plant: any) {
        this.dataAvailable = false;
        let ntfs = this.mockService.getAllMockNotifs(plant);

        this.notifsCount = ntfs.length;
        this.dataAvailable = true;
    }

    initialisation() {
        this.ordersCount = null;
        this.notifsCount = null;
        this.soCount = null;
        this.dataAvailable = false;

        this.storage.get("choosenPlant").then(
            (cp) => {
                if (cp != null && cp != undefined && cp !== "") {
                    this.choosenPlant = cp;
                    let plants = [{ Plant: this.choosenPlant }]
                    console.log("plants[0]: ",plants[0])
                    this.updateData(plants);

                }
            }
        )

        //getting PrioritySet from server
        this.getPriorities();
        //getting EffectSet from server
        this.getEffects();
        //getting CauseGroupSet from server
        this.getCauseGroups();
    }


    getEffects() {
        if (this.mock) {
            this.effectService.setEffects(this.mockService.getMockEffects());
        }
        else {
            this.effectService.getAllEffects().subscribe(
                (effects) => {
                    this.effectService.setEffects(effects.d.results);
                },
                (err) => {
                    console.log(err);
                }
            )
        }
    }

    getCauseGroups() {
        if (this.mock) {
            this.causeGroupService.setCauseGroups(this.mockService.getMockCG());
        }
        else {
            this.causeGroupService.getAllCauseGroups().subscribe(
                (causegroups) => {
                    this.causeGroupService.setCauseGroups(causegroups.d.results);
                },
                (err) => {
                    console.log(err);
                }
            )
        }
    }

    getPriorities() {
        if (this.mock) {
            this.priorityService.setPriorities(this.mockService.getMockPriorities());
        }
        else {
            this.priorityService.getAllPriorities().subscribe(
                (priorities) => {
                    this.priorityService.setPriorities(priorities.d.results);
                },
                (err) => {
                    console.log(err);
                }
            )
        }
    }
}