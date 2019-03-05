import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Data } from '../../providers/data';
import { FormControl } from '@angular/forms';
import {debounceTime} from 'rxjs/internal/operators';
import { MatSnackBar } from '@angular/material';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-details-settings',
  templateUrl: './details-settings.page.html',
  styleUrls: ['./details-settings.page.scss'],
})
export class DetailsSettingsPage implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  plants: any;
  checkedPlants = [];
  choosenPlant : any;

  constructor(public navCtrl: NavController, public dataService: Data,public modalController: ModalController,
              public snackBar: MatSnackBar,public storage: Storage) {

    this.searchControl = new FormControl();
    this.setFilteredItems();

    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {

      this.setFilteredItems();

    });
    

  }

  ionViewDidLoad() {
  }

  setFilteredItems() {
    this.storage.get("choosenPlant").then(
      (choosenPlantcode) =>{
          this.choosenPlant = choosenPlantcode;
          this.plants = this.dataService.filterItems(this.searchTerm);
          let plants = this.dataService.filterItems(this.searchTerm);
          let index = this.getPlantIndexFromCode(this.choosenPlant);
          plants[index].state="checked";
          this.plants = plants;

          if(this.checkedPlants.findIndex(x => x.code === this.choosenPlant) < 0){
            
            let plant = this.getPlantFromCode(this.choosenPlant);
            this.checkedPlants.push(plant);
          }
      },
      (err) =>{
        console.log("error",err);
      })
    
  }

  ngOnInit() {
  }

  closeModal(){
    //we gonna check if there are more than one plant choosen  
    if(this.checkedPlants.length>1) {
      this.openSnackBar("You have choosen more than one plant");
    }
    else if(this.checkedPlants.length==0) 
    {
      this.openSnackBar("Please select at least one planning plant");
    }
    else if(this.checkedPlants.length==1){
      //we save the item to session storage and close the modal
      this.storage.remove("choosenPlant").then(
        ()=>{  
           this.storage.set("choosenPlant",this.checkedPlants[0].code);
        },
        (err)=>{
            console.log(err);
        }
      )
      this.modalController.dismiss();
    }
  }

  notify(event,index) {
    let ind = this.getPlantIndexFromCode(this.choosenPlant);
    if(index!= ind && event.detail.checked == true){
      //if the item is checked we add it to the choosen ones
      this.checkedPlants.push(this.plants[index]);
      if(this.checkedPlants.length == 1){
        this.closeModal();
      }
    }
    else if(event.detail.checked == false){
      //we remove the item from the array
      let i = this.getPlantIndexFromCode(this.plants[index].code);//index on global plants array
      for(let j=0;j<this.checkedPlants.length;j++){
        if(this.plants[i].code === this.checkedPlants[j].code){
          this.checkedPlants.splice(j,1);
          break
        }
      }  
      this.plants[index].state="unchecked";
      if(this.checkedPlants.length == 1){
        this.closeModal();
      }
      
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  getPlantFromCode(code: string){
    let plant: any;
    let index = this.getPlantIndexFromCode(code);
    plant = this.plants[index];
    return plant;
  }

  getPlantIndexFromCode(code: string){
    let i = 0;
    let x;
    for(i=0;i<this.plants.length;i++){
      if(this.plants[i].code===code){
        return i; 
      }
    }
  }

}
