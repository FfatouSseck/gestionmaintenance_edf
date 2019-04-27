import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { Data } from '../../providers/data';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { MatSnackBar } from '@angular/material';
import { Storage } from '@ionic/storage';
import { PlantsService } from '../../providers/plants.service';
import { IPlant } from '../../interfaces/plant.interface';
import { MockService } from 'src/app/providers/mock.service';

@Component({
  selector: 'app-details-settings',
  templateUrl: './details-settings.page.html',
  styleUrls: ['./details-settings.page.scss'],
})
export class DetailsSettingsPage implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  plants: any[] = [];
  checkedPlants: IPlant[] = [];
  choosenPlant: any = "";
  syncPlant: any = "";
  notAvailable = true;
  searching: any = false;
  i = 0;

  constructor(public navCtrl: NavController, public dataService: Data, public modalController: ModalController,
    public snackBar: MatSnackBar, public storage: Storage, public navParams: NavParams, public plantService: PlantsService,
    public mockService: MockService) {

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(70)).subscribe(search => {
      this.searching = false;
      this.filterPlants();

    });


  }

  onSearchInput() {
    this.searching = true;
  }

  filterPlants(){
    this.plants = this.dataService.filterItems(this.searchTerm);
    if (this.plants.length > 0) {
      this.notAvailable = false;
      this.searching = false;
    }
  }

  setFilteredItems() {

    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null && choosenPlantcode != undefined) {
          this.choosenPlant = choosenPlantcode;

          this.plants = [];
          let plts = this.dataService.filterItems(this.searchTerm);
          this.plants = plts;

          let index = this.getPlantIndexFromCode(this.choosenPlant);

          if (index >= 0) {
            for (let i = 0; i < this.plants.length; i++) {
              this.plants[i].state = "unchecked";
            }
            this.plants[index].state = "checked";
          }
          //this.plants = plts;
          if (this.plants.length > 0) {
            this.notAvailable = false;
            this.searching = false;
          }

        }
        else {
          this.plants = this.dataService.filterItems(this.searchTerm);
          if (this.plants.length > 0) {
            this.notAvailable = false;
            this.searching = false;
          }
        }
      },
      (err) => {
        console.log("error", err);
      })

    this.storage.get('syncPlant').then(
      (syncPlant) => {
        if (syncPlant != null && syncPlant != undefined && syncPlant !== "") {
          let index = this.getPlantIndexFromCode(syncPlant);
          this.syncPlant = syncPlant;
          this.plants[index].state = "checked";
          this.initialPlants = this.plants;
        }
      }
    )

  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.checkedPlants = [];
    this.plants = [];

    this.storage.get("mock").then(
      (mock) => {
        if (mock != null && mock != undefined && mock == true) {
          this.dataService.emptyArray();
          let done = this.dataService.setPlants(this.mockService.getAllMockPlants());
          if (done) {
            this.notAvailable = true;
            this.setFilteredItems();
          }
        }
        else {
          let available = this.dataService.plantsAvailable();
          if (available) {
            this.notAvailable = true;
            this.setFilteredItems();
          }
          else {
            this.plantService.getAllPlants().subscribe(
              (plts) => {
                let p = plts.d.results;
                this.dataService.emptyArray();
                let done = this.dataService.setPlants(p);
                if (done) {
                  this.notAvailable = true;
                  this.setFilteredItems();
                }
              });
          }
        }
      })
  }

  cancel() {
    this.checkedPlants = this.plants.filter(plt => plt.state === 'checked');
    if (this.checkedPlants.length == 2 || this.checkedPlants.length == 1) {
      this.modalController.dismiss();
    }
    else this.closeModal();

  }

  closeModal() {

    //we gonna check if there are more than one plant choosen  
    if (this.checkedPlants.length > 2) {
      this.openSnackBar("You have choosen too many plants");

    }
    else if (this.checkedPlants.length == 0) {
      if (this.choosenPlant === "" || this.choosenPlant == undefined || this.choosenPlant == null) {
        this.openSnackBar("Please select at least one planning plant");
      }
      else {
        this.modalController.dismiss({
          'result': this.choosenPlant
        });
      }
    }
    else if (this.checkedPlants.length == 2) {
      //we save the item to session storage and close the modal

      this.storage.set("choosenPlant", this.checkedPlants[0].Plant);
      this.storage.set("choosenPlantDescr", this.checkedPlants[0].PlantDescr);
      this.storage.set("syncPlant", this.checkedPlants[1].Plant);
      this.storage.set("syncPlantDescr", this.checkedPlants[1].PlantDescr);
      this.modalController.dismiss({
        'result': this.checkedPlants
      });


    }
    else if (this.checkedPlants.length == 1) {
      this.storage.set("choosenPlant", this.checkedPlants[0].Plant);
      this.storage.set("choosenPlantDescr", this.checkedPlants[0].PlantDescr);
      this.storage.remove("syncPlant").then(
        () => {
          this.storage.remove("syncPlantDescr").then(
            () => {
              this.modalController.dismiss({
                'result': this.choosenPlant
              });
            }
          )
          .catch(
            ()=>{
              this.modalController.dismiss({
                'result': this.choosenPlant
              });
            }
          )
        }
      )
    }
  }

  choose(plant) {
    let indexToAdd = this.getPlantIndexFromCode(plant.Plant);
    this.plants[indexToAdd].state = "checked";
    this.checkedPlants = this.plants.filter(plt => plt.state === 'checked');

    this.closeModal();
  }

  notify(event, index) {

    if (event.detail.checked == true) {
      this.plants[index].state = "checked";

    }

    else if (event.detail.checked == false) {
      this.plants[index].state = "unchecked";
    }

    this.checkedPlants = this.plants.filter(plt => plt.state === 'checked');
  }

  checkIfExistsInArray(elt, arr) {
    let exists = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].Plant === elt.Plant) {
        exists = true;
        break
      }
    }

    return exists;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  getPlantFromCode(code: string) {
    let plant: any;
    let index = this.getPlantIndexFromCode(code);
    plant = this.plants[index];
    return plant;
  }

  getPlantIndexFromCode(code: string) {
    let i = 0;
    for (i = 0; i < this.plants.length; i++) {
      if (this.plants[i].Plant === code) {
        return i;
      }
    }
  }

}
