import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { DamageGroup } from 'src/app/interfaces/damagegroup.interface';
import { DamagegroupService } from 'src/app/providers/damagegroup.service';
import { Storage } from '@ionic/storage';
import { MockService } from 'src/app/providers/mock.service';

@Component({
  selector: 'app-damage-group',
  templateUrl: './damage-group.page.html',
  styleUrls: ['./damage-group.page.scss'],
})
export class DamageGroupPage implements OnInit {
  searchTerm: string = '';
  searchControl: FormControl;
  damageGroups: DamageGroup[] = [];
  notAvailable = true;
  noData = false;
  mock = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams, private mockService: MockService,
    public damageGroupService: DamagegroupService, private storage: Storage) {

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {

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

  setFilteredItems() {
    this.damageGroups = this.damageGroupService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    //getting CauseGroupSet from server
    this.getDamageGroups();
  }

  getDamageGroups() {
    if (this.mock) {
      this.damageGroupService.setDamageGroups(this.mockService.getMockDamageGroups());
      if (this.damageGroupService.checkAvailability()) {
        this.damageGroups = this.damageGroupService.getAvailableDamageGroups();

        if (this.damageGroups.length == 0) {
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
    }
    else {
      this.damageGroupService.getAllDamageGroups().subscribe(
        (damagegroups) => {
          this.damageGroupService.setDamageGroups(damagegroups.d.results);

          if (this.damageGroupService.checkAvailability()) {
            this.damageGroups = this.damageGroupService.getAvailableDamageGroups();

            if (this.damageGroups.length == 0) {
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
        })
    }
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
