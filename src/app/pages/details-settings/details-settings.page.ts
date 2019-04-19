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
          this.syncPlant = syncPlant;
          this.plants[index].state = "checked";
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
    else if (this.choosenPlant !== "") {
      this.modalController.dismiss({
        'result': this.choosenPlant
      });
    }
  }

  choose(plant) {
    if (this.choosenPlant !== "") {
      let ind = this.getPlantIndexFromCode(this.choosenPlant);
      let cp = this.checkedPlants;
      let indexToAdd = this.getPlantIndexFromCode(plant.Plant);

      if (this.checkIfExistsInArray(this.plants[ind],this.checkedPlants) == false) {
        this.checkedPlants.push(this.plants[ind]);
      }
      
      if (ind != indexToAdd && this.checkIfExistsInArray(plant,this.checkedPlants) == false) {
        this.checkedPlants.push(plant);
      }
    }
    else {
      
      if (this.checkIfExistsInArray(plant,this.checkedPlants) == false) {
        this.checkedPlants.push(plant);
      }
    }
    if (this.checkedPlants.length == 1) {
      this.storage.set("choosenPlant", plant.Plant);
      this.storage.set("choosenPlantDescr", plant.PlantDescr);
      this.modalController.dismiss({
        'result': this.checkedPlants
      });
    }
    else if (this.checkedPlants.length == 2) {
      this.storage.set("choosenPlant", this.checkedPlants[1].Plant);
      this.storage.set("choosenPlantDescr", this.checkedPlants[1].PlantDescr);
      this.storage.set("syncPlant", this.checkedPlants[0].Plant);
      this.storage.set("syncPlantDescr", this.checkedPlants[0].PlantDescr);
      this.modalController.dismiss({
        'result': this.checkedPlants
      });
    }
    else{
      this.closeModal();
    }
   
  }

  notify(event, index) {

    if (event.detail.checked == true) {

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
              console.log(this.checkIfExistsInArray(elt,this.checkedPlants) == false);
              
              if (this.checkIfExistsInArray(elt,this.checkedPlants) == false) {
                this.checkedPlants.push(elt);
                this.i++;
              }
            }
          })
        let ind = this.getPlantIndexFromCode(this.choosenPlant);
        
        if (index != ind && this.checkIfExistsInArray(this.plants[index],this.checkedPlants) == false) {
          this.checkedPlants.push(this.plants[index]);
          if (this.checkedPlants.length == 2) {
            this.closeModal();
          }
        }
      }
      else {//we do not have a choosen plant
        this.checkedPlants.push(this.plants[index]);
        if (this.checkedPlants.length == 2) {
          this.closeModal();
        }
      }

    }

    else if (event.detail.checked == false) {
      //we remove the item from the array
      let ind = this.getPlantIndexFromCode(this.choosenPlant);
      let indSync = this.getPlantIndexFromCode(this.syncPlant);
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
      else if(i == indSync){
        this.storage.remove("syncPlant").then(
          () => {
            this.storage.remove("syncPlantDescr").then(
              () => {
                this.syncPlant = "";
              }
            )
          }
        )
      }
      console.log(this.checkedPlants);
    }
  }

  checkIfExistsInArray(elt,arr){
    let exists = false;
    for(let i=0;i<arr.length;i++){
      if(arr[i].Plant === elt.Plant){
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
