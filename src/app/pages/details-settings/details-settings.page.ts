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
  plants: any[]=[];
  checkedPlants: IPlant[] = [];
  choosenPlant: any;
  notAvailable = true;
  searching: any = false;

  constructor(public navCtrl: NavController, public dataService: Data, public modalController: ModalController,
    public snackBar: MatSnackBar, public storage: Storage, public navParams: NavParams, public plantService: PlantsService,
    public mockService: MockService) {

    this.searchControl = new FormControl();
    /*this.searchControl.valueChanges.pipe(debounceTime(70)).subscribe(search => {
      console.log("iciiii changing")
      this.searching = false;
      this.setFilteredItems();

    });*/


  }

  onSearchInput() {
    this.searching = true;
    this.setFilteredItems();
  }

  setFilteredItems() {
    
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) => {
        if (choosenPlantcode != null) {
          this.choosenPlant = choosenPlantcode;

          this.plants = [];
          let plts = this.dataService.filterItems(this.searchTerm);
          console.log("plts: ",plts);

          let index = this.getPlantIndexFromCode(this.choosenPlant);

          if (index >= 0) {
            for (let i = 0; i < plts.length; i++) {
              plts[i].state = "unchecked";
            }
            plts[index].state = 'checked';
          }
          this.plants = plts;
          if(this.plants.length > 0){
            this.notAvailable = false;
            this.searching = false;
          }
        }
        else {
          this.plants = this.dataService.filterItems(this.searchTerm);
          if(this.plants.length > 0){
            this.notAvailable = false;
            this.searching = false;
          }
        }


      },
      (err) => {
        console.log("error", err);
      })

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
            console.log("from mock server: done=>",done);
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
    //we gonna check if there are more than one plant choosen  
    if (this.checkedPlants.length > 1) {
      this.openSnackBar("You have choosen more than one plant");
    }
    else if (this.checkedPlants.length == 0) {
      if (this.choosenPlant === "" || this.choosenPlant == undefined) {
        this.openSnackBar("Please select at least one planning plant");
      }
      else {
        this.modalController.dismiss({
          'result': this.choosenPlant
        });
      }
    }
    else if (this.checkedPlants.length == 1) {
      //we save the item to session storage and close the modal
      this.storage.remove("choosenPlant").then(
        () => {
          this.storage.set("choosenPlant", this.checkedPlants[0].Plant);
          this.storage.set("choosenPlantDescr", this.checkedPlants[0].PlantDescr);
          this.modalController.dismiss({
            'result': this.checkedPlants[0].Plant
          });
        },
        (err) => {
          console.log(err);
        }
      )

    }
    else if (this.choosenPlant !== "") {
      this.modalController.dismiss({
        'result': this.choosenPlant
      });
    }
  }

  choose(plant) {
    this.checkedPlants = [];
    this.checkedPlants.push(plant);
    this.closeModal();
  }

  notify(event, index) {
    console.log("icii",event,index);
    let ind = this.getPlantIndexFromCode(this.choosenPlant);
    if (index != ind && event.detail.checked == true) {
      //if the item is checked we add it to the choosen ones
      this.checkedPlants.push(this.plants[index]);
      if (this.checkedPlants.length == 1) {
        this.closeModal();
      }
    }
    else if (event.detail.checked == false) {
      //we remove the item from the array
      let i = this.getPlantIndexFromCode(this.plants[index].Plant);//index on global plants array
      for (let j = 0; j < this.checkedPlants.length; j++) {
        if (this.plants[i].Plant === this.checkedPlants[j].Plant) {
          this.checkedPlants.splice(j, 1);
          break
        }
      }
      this.plants[index].state = "unchecked";
      if (this.checkedPlants.length == 1) {
        this.closeModal();
      }

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
    let x;
    for (i = 0; i < this.plants.length; i++) {
      if (this.plants[i].Plant === code) {
        return i;
      }
    }
  }

}
