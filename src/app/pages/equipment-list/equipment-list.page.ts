import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { EquipmentService } from 'src/app/providers/equipment.service';


@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.page.html',
  styleUrls: ['./equipment-list.page.scss'],
})
export class EquipmentListPage implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  equipments: any[] = [];
  notAvailable = true;
  noData = false;
  functLoc = "";
  searching: any = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public equipmentService: EquipmentService) {

    this.functLoc = "";
    this.functLoc = navParams.get('functLoc');
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {

      this.setFilteredItems();

    });

  }

  ngOnInit() {
  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredItems() {
    this.equipments = this.equipmentService.filterItems(this.searchTerm);
    this.searching = false;
  }

  ionViewDidEnter() {
    this.noData = false;
    //getting CauseGroupSet from server
    this.equipments = [];
    this.equipmentService.getAllEquipmentsByFunctLoc(this.functLoc).subscribe(
      (equipments) => {
        this.equipmentService.setEquipments(equipments.d.results);
        if (this.equipmentService.checkAvailability()) {
          this.equipments = this.equipmentService.getAvailableEquipments();
          if (this.equipments.length == 0) {
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
