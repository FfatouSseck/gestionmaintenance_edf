import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { debounceTime } from 'rxjs/internal/operators';


@Component({
  selector: 'app-work-center-list',
  templateUrl: './work-center-list.page.html',
  styleUrls: ['./work-center-list.page.scss'],
})
export class WorkCenterListPage implements OnInit {

  @Input() workCenters: any;
  notAvailable = true;
  noData = false;
  searching: any = false;
  searchTerm: string = '';
  searchControl: FormControl;

  constructor(public modalController: ModalController) {
    console.log("workcenters");
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  setFilteredItems(){
    this.workCenters = this.filterWorkCenters();
  }

  filterWorkCenters(){
    return this.workCenters.filter(
      (st) =>{
        return (st.WorkCenterDescr.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
             || st.WorkCenterShort.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
             || st.WorkCenter.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
      })
  }

  choose(wc){
    this.modalController.dismiss({
      'result' : wc
    });
  }

  onSearchInput(){
    this.searching = true;
  }

  ngOnInit() {
    if(this.workCenters.length>0){
      this.notAvailable = false;
      this.noData = false;
    }
    else{
      this.notAvailable = false;
      this.noData = true;
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
