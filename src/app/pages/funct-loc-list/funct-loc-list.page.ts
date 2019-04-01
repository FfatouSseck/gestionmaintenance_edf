import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { FunctlocService } from 'src/app/providers/functloc.service';
import { Storage } from '@ionic/storage';
import { MockService } from 'src/app/providers/mock.service';


@Component({
  selector: 'app-funct-loc-list',
  templateUrl: './funct-loc-list.page.html',
  styleUrls: ['./funct-loc-list.page.scss'],
})
export class FunctLocListPage implements OnInit {
  searchTerm: string = '';
  searchControl: FormControl;
  functLocs: any[] = [];
  notAvailable = true;
  noData = false;
  plantCode = "";
  searching: any = false;
  mock = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,private storage: Storage,
    public functLocService: FunctlocService, private mockService: MockService) {

    this.plantCode = navParams.get('plantCode');
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {

      this.searching = false;
      this.setFilteredItems();

    });
  }

  ngOnInit() {
    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null) {
          this.mock = mock;
        }
      })
  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredItems() {
    this.functLocs = this.functLocService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    this.noData = false;
    //getting FunctLocSet from server
    this.functLocs = [];
    this.getFunctLocs(this.plantCode);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  choose(functloc) {
    this.modalController.dismiss({
      'result': functloc
    });
  }

  getFunctLocs(codePlant){
    if(this.mock){
      this.functLocService.setFunctLocs(this.mockService.getMockFunctLocsByPlant(codePlant));
      if (this.functLocService.checkAvailability()) {
            this.functLocs = this.functLocService.getAvailableFunctLocs();
  
            if (this.functLocs.length == 0) {
              this.notAvailable = false;
              this.noData = true;
            }
            else {
              this.notAvailable = false;
              this.noData = false;
            }
          }
          else {
            this.notAvailable = false;
            this.noData = true;
          }
    }
    else{
      this.functLocService.getAllFunctLocByPlant(this.plantCode).subscribe(
        (functLocs) => {
          this.functLocService.setFunctLocs(functLocs.d.results);
          if (this.functLocService.checkAvailability()) {
            this.functLocs = this.functLocService.getAvailableFunctLocs();
  
            if (this.functLocs.length == 0) {
              this.notAvailable = false;
              this.noData = true;
            }
            else {
              this.notAvailable = false;
              this.noData = false;
            }
          }
          else {
            this.notAvailable = false;
            this.noData = true;
          }
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }


}
