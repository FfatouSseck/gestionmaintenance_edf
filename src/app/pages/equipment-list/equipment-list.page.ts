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
  functLoc = "";

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public equipmentService: EquipmentService) {

    this.functLoc = navParams.get('functLoc');
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {

      this.setFilteredItems();

    });

  }

  ngOnInit() {
  }

  setFilteredItems() {
    this.equipments = this.equipmentService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    //getting CauseGroupSet from server
    this.equipments = [];
    this.equipmentService.getAllEquipmentsByFunctLoc(this.functLoc).subscribe(
      (equipments) => {
        console.log(equipments.d.results);
        this.equipmentService.setEquipments(equipments.d.results);
        this.equipments = this.equipmentService.getAvailableEquipments();
        if (this.equipments.length == 0) {
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
