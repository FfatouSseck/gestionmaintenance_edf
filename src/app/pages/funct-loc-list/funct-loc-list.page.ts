import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { FunctlocService } from 'src/app/providers/functloc.service';


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

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public functLocService: FunctlocService) {

    this.plantCode = navParams.get('plantCode');
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {

      this.searching = false;
      this.setFilteredItems();

    });
  }

  ngOnInit() {
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

  closeModal() {
    this.modalController.dismiss();
  }

  choose(functloc) {
    this.modalController.dismiss({
      'result': functloc
    });
  }


}
