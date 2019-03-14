import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CausegroupService } from 'src/app/providers/causegroup.service';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { CauseGroup } from 'src/app/interfaces/causegroup.interface';


@Component({
  selector: 'app-cause-group-list',
  templateUrl: './cause-group-list.page.html',
  styleUrls: ['./cause-group-list.page.scss'],
})
export class CauseGroupListPage implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  causeGroups: CauseGroup[]=[];

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public causeGroupService: CausegroupService) {

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {

      this.setFilteredItems();

    });

  }

  ngOnInit() {
  }

  setFilteredItems(){
     this.causeGroups = this.causeGroupService.filterItems(this.searchTerm);
  }

  ionViewDidEnter(){
    //getting CauseGroupSet from server
    if (this.causeGroupService.checkAvailability()) {
      this.causeGroups = this.causeGroupService.getAvailableCausegroups();
    }
    else {
      this.causeGroupService.getAllCauseGroups().subscribe(
        (causegroups) => {
          this.causeGroupService.setCauseGroups(causegroups.d.results);
          this.causeGroups = this.causeGroupService.getAvailableCausegroups();
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  choose(cg){
    this.modalController.dismiss({
      'result': cg
    });
  }

}
