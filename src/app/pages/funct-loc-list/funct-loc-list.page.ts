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
  firstLevelFLOC : any;
  searching: any = false;
  mock = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams, public functLocService: FunctlocService,
    private mockService: MockService, private storage: Storage, ) {

    this.plantCode = navParams.get('plantCode');
    this.firstLevelFLOC = navParams.get("firstLevelFLOC");
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
    if (this.firstLevelFLOC != null && this.firstLevelFLOC != undefined && this.firstLevelFLOC !== ""){
      this.functLocService.filterItems(this.searchTerm);
    }
    else this.functLocs = this.functLocService.filterFirstLevel(this.searchTerm);
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

  choose(firstLevelFLOC) {
    this.modalController.dismiss({
      'result': firstLevelFLOC
    });
  }

  chooseFL(fl){
    this.modalController.dismiss({
      'result': fl
    });
  }

  getFunctLocs(codePlant) {
    if (this.mock) {
      if (this.firstLevelFLOC != null && this.firstLevelFLOC != undefined && this.firstLevelFLOC !== "") {
        this.functLocService.setFunctLocs(this.mockService.getMockFunctLocsByPlantAndFirstLevelFLOC(codePlant,this.firstLevelFLOC));
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
      else {
        this.functLocService.setFunctLocs(this.getFirstLevelFLOC(this.mockService.getMockFunctLocsByPlant(codePlant)));
        if (this.functLocService.checkAvailability()) {
          let functLocs1 = this.functLocService.getAvailableFunctLocs();

          if (functLocs1.length == 0) {
            this.notAvailable = false;
            this.noData = true;
          }
          else {
            this.notAvailable = false;
            this.noData = false;
            this.functLocs = this.getFirstLevelFLOC(functLocs1);
          }
        }
        else {
          this.notAvailable = false;
          this.noData = true;
        }
      }

    }
    else {
      if (this.firstLevelFLOC != null && this.firstLevelFLOC != undefined && this.firstLevelFLOC !== "") {
        this.functLocService.getAllFunctLocByPlantAndFirstLevelFLOC(this.plantCode,this.firstLevelFLOC).subscribe(
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
          })
      }
      else {
        this.functLocService.getAllFunctLocByPlant(this.plantCode).subscribe(
          (functLocs) => {
            this.functLocService.setFunctLocs(this.getFirstLevelFLOC(functLocs.d.results));
            if (this.functLocService.checkAvailability()) {
              let functLocs1 = this.functLocService.getAvailableFunctLocs();

              if (functLocs1.length == 0) {
                this.notAvailable = false;
                this.noData = true;
              }
              else {
                this.notAvailable = false;
                this.noData = false;
                this.functLocs = this.getFirstLevelFLOC(functLocs1);
                console.log(this.functLocs)
              }
            }
            else {
              this.notAvailable = false;
              this.noData = true;
            }
          },
          (err) => {
            console.log(err);
          })
      }
    }
  }

  getFirstLevelFLOC(arr) {
    //SupFunctLoc
    let firstLevelFLOCs: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].SupFunctLoc !== "") {
        firstLevelFLOCs.push(arr[i].SupFunctLoc);
      }
    }
    return this.getUnique(firstLevelFLOCs);
  }

  getUnique(arr: string[]) {
    return arr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }


}
