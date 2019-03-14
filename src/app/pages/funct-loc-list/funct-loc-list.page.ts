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
  plantCode = "";

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public functLocService: FunctlocService) {

    this.plantCode = navParams.get('plantCode');
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {

      this.setFilteredItems();

    });
  }

  ngOnInit() {
  }

  setFilteredItems() {
    this.functLocs = this.functLocService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    //getting CauseGroupSet from server
    this.functLocs = [];
    this.functLocService.getAllFunctLocByPlant(this.plantCode).subscribe(
      (functLocs) => {
        console.log(functLocs.d.results);
        this.functLocService.setFunctLocs(functLocs.d.results);
        this.functLocs = this.functLocService.getAvailableFunctLocs();
        if (this.functLocs.length == 0) {
          this.notAvailable = true;
        }
        else this.notAvailable = false;
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
