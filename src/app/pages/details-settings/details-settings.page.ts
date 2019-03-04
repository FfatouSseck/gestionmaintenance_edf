import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Data } from '../../providers/data';
import { FormControl } from '@angular/forms';
//import 'rxjs/add/operator/debounceTime';
import {debounceTime} from 'rxjs/internal/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
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

  constructor(public navCtrl: NavController, public dataService: Data,public modalController: ModalController,
              public storage: NativeStorage,public snackBar: MatSnackBar) {
    this.searchControl = new FormControl();
    this.setFilteredItems();

    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {

      this.setFilteredItems();

    });
  }

  ionViewDidLoad() {
  }

  setFilteredItems() {

    this.plants = this.dataService.filterItems(this.searchTerm);

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
      this.storage.setItem("choosenPlant",this.checkedPlants[0].code);
      this.modalController.dismiss();
    }
  }

  notify(event,index) {
    console.log(event);
    if(event.detail.checked == true){
      //if the item is checked we add it to the choosen ones
      this.checkedPlants.push(this.plants[index]);
      console.log("after adding",this.checkedPlants);
    }
    else{
      //we remove the item from the array
      for(let i=0;i<this.checkedPlants.length;i++){
        if(this.checkedPlants[i].code==this.plants[index].code){
            this.checkedPlants.splice(i,1);
        }
      }
      console.log("after removing",this.checkedPlants);
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

}
