import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Data } from '../../providers/data';
import { FormControl } from '@angular/forms';
//import 'rxjs/add/operator/debounceTime';
import {debounceTime} from 'rxjs/internal/operators';

@Component({
  selector: 'app-details-settings',
  templateUrl: './details-settings.page.html',
  styleUrls: ['./details-settings.page.scss'],
})
export class DetailsSettingsPage implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  plants: any;

  constructor(public navCtrl: NavController, public dataService: Data,public modalController: ModalController) {
    this.searchControl = new FormControl();
    this.setFilteredItems();

    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {

      this.setFilteredItems();

    });
  }

  ionViewDidLoad() {

    console.log("iciiiiiiii");
    

  }

  setFilteredItems() {

    this.plants = this.dataService.filterItems(this.searchTerm);

  }

  ngOnInit() {
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
