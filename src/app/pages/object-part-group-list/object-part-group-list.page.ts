import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { ObjectPartGroup } from 'src/app/interfaces/objectpartgroup.interface';
import { ObjectpartgroupService } from 'src/app/providers/objectpartgroup.service';
import { Storage } from '@ionic/storage';
import { MockService } from 'src/app/providers/mock.service';


@Component({
  selector: 'app-object-part-group-list',
  templateUrl: './object-part-group-list.page.html',
  styleUrls: ['./object-part-group-list.page.scss'],
})
export class ObjectPartGroupListPage implements OnInit {
  searchTerm: string = '';
  searchControl: FormControl;
  objectPartGroups: ObjectPartGroup[] = [];
  notAvailable = true;
  noData = false;
  mock = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public objectPartGroupService: ObjectpartgroupService,
    private mockService: MockService, private storage: Storage, ) {

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
    this.objectPartGroups = this.objectPartGroupService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    //getting OPGroupSet from server
    this.getOPG();
  }

  getOPG() {
    if (this.mock) {
      this.objectPartGroupService.setObjectPartGroups(this.mockService.getObjectPartGroups());
      if (this.objectPartGroupService.checkAvailability()) {
        this.objectPartGroups = this.objectPartGroupService.getAvailableObjectPartGroups();

        if (this.objectPartGroups.length == 0) {
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
      this.objectPartGroupService.getAllObjectPartGroups().subscribe(
        (causegroups) => {
          this.objectPartGroupService.setObjectPartGroups(causegroups.d.results);

          if (this.objectPartGroupService.checkAvailability()) {
            this.objectPartGroups = this.objectPartGroupService.getAvailableObjectPartGroups();

            if (this.objectPartGroups.length == 0) {
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
