import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CausegroupService } from 'src/app/providers/causegroup.service';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { CauseGroup } from 'src/app/interfaces/causegroup.interface';
import { Storage } from '@ionic/storage';
import { MockService } from 'src/app/providers/mock.service';


@Component({
  selector: 'app-cause-group-list',
  templateUrl: './cause-group-list.page.html',
  styleUrls: ['./cause-group-list.page.scss'],
})
export class CauseGroupListPage implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  causeGroups: CauseGroup[]=[];
  notAvailable= true;
  mock = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
              public causeGroupService: CausegroupService,private mockService: MockService,private storage: Storage,) {

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

  setFilteredItems(){
     this.causeGroups = this.causeGroupService.filterItems(this.searchTerm);
  }

  ionViewDidEnter(){
    //getting CauseGroupSet from server
    this.getCauseGroups();
  }

  getCauseGroups(){
    if(this.mock){
      this.causeGroupService.setCauseGroups(this.mockService.getMockCG());
          this.causeGroups = this.causeGroupService.getAvailableCausegroups();

          if(this.causeGroups.length==0){
            this.notAvailable = true;
          }
          else this.notAvailable=false;
    }
    else{
      this.causeGroupService.getAllCauseGroups().subscribe(
        (causegroups) => {
          this.causeGroupService.setCauseGroups(causegroups.d.results);
          this.causeGroups = this.causeGroupService.getAvailableCausegroups();

          if(this.causeGroups.length==0){
            this.notAvailable = true;
          }
          else this.notAvailable=false;
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
