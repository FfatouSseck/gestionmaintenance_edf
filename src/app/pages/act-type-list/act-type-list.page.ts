import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MockService } from 'src/app/providers/mock.service';
import { ActTypeService } from 'src/app/providers/act-type.service';
import { debounceTime } from 'rxjs/internal/operators';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-act-type-list',
  templateUrl: './act-type-list.page.html',
  styleUrls: ['./act-type-list.page.scss'],
})
export class ActTypeListPage implements OnInit {

  @Input() plant: string;
  @Input() workCenter: string;
  actList: any[] = [];
  notAvailable = true;
  noData = false;
  searching: any = false;
  searchTerm: string = '';
  searchControl: FormControl;

  constructor(public modalController: ModalController, private mockService: MockService,
    private storage: Storage, private actService: ActTypeService) {
    this.searchControl = new FormControl();

    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  choose(act) {
    this.modalController.dismiss({
      'result': act
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }


  setFilteredItems() {
    this.actList = this.filterActTypes();
  }

  filterActTypes() {
    return this.actList.filter(
      (act) => {
        return (act.PersonNo.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          || act.UserFullName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
      })
  }

  ionViewDidEnter() {
    this.notAvailable = true;
    console.log("plant: ",this.plant,"wc: ",this.workCenter);
    if(this.workCenter != undefined){
      if(this.plant != undefined){

      }
    }
    else{//wc = undefined
      console.log("Please choose a wc first");
      
    }
    // if (this.op.WorkCenter !== '') {
    //   if (this.op.Plant !== '') {
    //     if (this.mock) {
    //       actTypes = this.mockService.getMockActTypes(this.op.Plant, this.op.WorkCenter)
    //       console.log("actTypes: ", actTypes);
    //     }
    //     else {//if(this.mock)
    //       this.actTypeService.getAllActTypesByPlantAndWorkCenter(this.op.Plant, this.op.WorkCenter)
    //         .subscribe(
    //           (acts) => {
    //             console.log("activities: ", acts.d.results);
    //           },
    //           (err) => {

    //           })
    //     }
    //   }
    //   else {//if(this.op.Plant !== '')
    //     console.log("No workCenter available !");
    //   }
    // }
    // else {//if(this.op.WorkCenter !== '')
    //   console.log("No workCenter available !");
    // }

  }

}
