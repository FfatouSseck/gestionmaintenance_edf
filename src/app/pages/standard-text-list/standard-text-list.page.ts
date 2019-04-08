import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';

@Component({
  selector: 'app-standard-text-list',
  templateUrl: './standard-text-list.page.html',
  styleUrls: ['./standard-text-list.page.scss'],
})
export class StandardTextListPage implements OnInit {
  @Input() standardTexts: any;
  notAvailable = true;
  noData = false;
  searching: any = false;
  searchTerm: string = '';
  searchControl: FormControl;

  constructor(public modalController: ModalController) {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  setFilteredItems(){
    this.standardTexts = this.filterStandardTexts();
  }

  filterStandardTexts(){
    return this.standardTexts.filter(
      (st) =>{
        return (st.StandardTextKey.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
             || st.ShortText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
      })
  }

  choose(st){
    this.modalController.dismiss({
      'result' : st
    });
  }

  onSearchInput(){
    this.searching = true;
  }

  ngOnInit() {
    if(this.standardTexts.length>0){
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
