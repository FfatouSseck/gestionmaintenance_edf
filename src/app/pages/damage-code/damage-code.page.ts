import { Component, OnInit } from '@angular/core';
import { DamageCode } from 'src/app/interfaces/damagecode.interface';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { DamagecodeService } from 'src/app/providers/damagecode.service';

@Component({
  selector: 'app-damage-code',
  templateUrl: './damage-code.page.html',
  styleUrls: ['./damage-code.page.scss'],
})
export class DamageCodePage implements OnInit {
  searchTerm: string = '';
  searchControl: FormControl;
  damageCodes: DamageCode[] = [];
  damageGroup = "";
  notAvailable = true;
  noData = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public damagecodeService: DamagecodeService) {

    this.damageGroup = navParams.get('dg');
    console.log("dg", this.damageGroup);
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {

      this.setFilteredItems();

    });
  }

  ngOnInit() {
  }

  
  setFilteredItems() {
    this.damageCodes = this.damagecodeService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    //getting CauseGroupSet from server

    this.damagecodeService.getAllDamageCodesByGroup(this.damageGroup).subscribe(
      (objectPartCodes) => {
        console.log(objectPartCodes.d.results)
        this.damagecodeService.setDamageCodes(objectPartCodes.d.results);

        if (this.damagecodeService.checkAvailability()) {
          this.damageCodes = this.damagecodeService.getAvailableDamageCodes();

          if (this.damageCodes.length == 0) {
            this.notAvailable = true;
            this.noData = false;
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

  choose(cg) {
    this.modalController.dismiss({
      'result': cg
    });
  }

}
