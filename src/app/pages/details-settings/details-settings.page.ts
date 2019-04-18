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
      this.setFilteredItems();

    });


  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredItems() {

    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
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
          console.log("syncPlant: ", syncPlant, " index: ", index);
          this.syncPlant = syncPlant;
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
          console.log("from remote server");
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

  closeModal() {
    console.log("let's close it");

    //we gonna check if there are more than one plant choosen  
    if (this.checkedPlants.length > 2) {
      console.log("here");
      this.openSnackBar("You have choosen too many plants");
    }
    else if (this.checkedPlants.length == 0) {
      console.log("here");
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
      console.log("here");
      //we save the item to session storage and close the modal

      this.storage.set("choosenPlant", this.checkedPlants[0].Plant);
      this.storage.set("choosenPlantDescr", this.checkedPlants[0].PlantDescr);
      this.storage.set("syncPlant", this.checkedPlants[1].Plant);
      this.storage.set("syncPlantDescr", this.checkedPlants[1].PlantDescr);
      this.modalController.dismiss({
        'result': this.checkedPlants
      });


    }
    else if (this.choosenPlant !== "") {
      console.log("here");
      this.modalController.dismiss({
        'result': this.choosenPlant
      });
    }
  }

  choose(plant) {
    console.log("here");
    if (this.choosenPlant !== "") {
      let ind = this.getPlantIndexFromCode(this.choosenPlant);
      let indexToAdd = this.getPlantIndexFromCode(plant.Plant);

      if (!this.checkedPlants.includes(this.plants[ind])) {
        this.checkedPlants.push(this.plants[ind]);
      }
      if (ind != indexToAdd && !this.checkedPlants.includes(plant)) {
        this.checkedPlants.push(plant);
      }
    }
    else {
      if (!this.checkedPlants.includes(plant)) {
        this.checkedPlants.push(plant);
      }
    }
    if (this.checkedPlants.length == 1) {
      this.storage.set("choosenPlant", plant.Plant);
      this.storage.set("choosenPlantDescr", plant.PlantDescr);
    }
    else if (this.checkedPlants.length == 2) {
      this.storage.set("choosenPlant", this.checkedPlants[0].Plant);
      this.storage.set("choosenPlantDescr", this.checkedPlants[0].PlantDescr);
      this.storage.set("syncPlant", this.checkedPlants[1].Plant);
      this.storage.set("syncPlantDescr", this.checkedPlants[1].PlantDescr);
    }
    this.modalController.dismiss({
      'result': this.checkedPlants
    });
  }

  notify(event, index) {

    if (event.detail.checked == true) {
      console.log(this.checkedPlants);

      if (this.choosenPlant !== "" && this.i == 0) {
        this.storage.get("choosenPlantDescr").then(
          (choosenPlantDescr) => {
            if (choosenPlantDescr !== "" && choosenPlantDescr != null
              && choosenPlantDescr != undefined) {
              let elt = {
                Plant: this.choosenPlant,
                PlantDescr: this.choosenPlant,
                state: "unchecked"
              }
              if (!this.checkedPlants.includes(elt)) {
                console.log("here");

                this.checkedPlants.push(elt);
                console.log(this.checkedPlants)
                this.i++;
              }
              else console.log("here");
            }
          })
        let ind = this.getPlantIndexFromCode(this.choosenPlant);
        console.log("index to add: ", index, " index of cp: ", ind);
        if (index != ind && !this.checkedPlants.includes(this.plants[index])) {
          this.checkedPlants.push(this.plants[index]);
          console.log(this.checkedPlants)
          if (this.checkedPlants.length == 2) {
            this.closeModal();
          }
        }
      }
      else {//we do not have a choosen plant
        this.checkedPlants.push(this.plants[index]);
        console.log(this.checkedPlants)
        if (this.checkedPlants.length == 2) {
          this.closeModal();
        }
      }

    }

    else if (event.detail.checked == false) {
      console.log("here");
      //we remove the item from the array
      let ind = this.getPlantIndexFromCode(this.choosenPlant);
      let i = this.getPlantIndexFromCode(this.plants[index].Plant);//index on global plants array
      for (let j = 0; j < this.checkedPlants.length; j++) {
        if (this.plants[i].Plant === this.checkedPlants[j].Plant) {
          this.checkedPlants.splice(j, 1);
          break;
        }
      }
      this.plants[index].state = "unchecked";
      console.log("index to delete: ", i, " index of cp: ", ind);
      if (i == ind) {
        console.log("here we remove choosenPlant")
        this.storage.remove("choosenPlant").then(
          () => {
            this.storage.remove("choosenPlantDescr").then(
              () => {
                this.choosenPlant = "";
              }
            )
          }
        )
      }
      console.log(this.checkedPlants);
    }
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
