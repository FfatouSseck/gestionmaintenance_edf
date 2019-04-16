import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { Storage } from '@ionic/storage';
import { MockService } from 'src/app/providers/mock.service';
import { StandardTextService } from 'src/app/providers/standard-text.service';

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

  constructor(public modalController: ModalController, private storage: Storage, private standardTextService: StandardTextService,
    private mockService: MockService) {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  setFilteredItems() {
    this.standardTexts = this.filterStandardTexts();
  }

  filterStandardTexts() {
    return this.standardTexts.filter(
      (st) => {
        return (st.StandardTextKey.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          || st.ShortText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
      })
  }

  choose(st) {
    this.modalController.dismiss({
      'result': st
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

  ionViewDidEnter() {
    this.storage.get("mock").then(
      (mock) => {
        if (mock != null && mock != undefined && mock == true) {
          this.standardTexts = this.mockService.getMockStandardTextsSet();
          if (this.standardTexts.length > 0) {
            this.notAvailable = false;
            this.noData = false;
          }
          else {
            this.notAvailable = false;
            this.noData = true;
          }
        }
        else {
          this.standardTextService.getAllStandardTexts().subscribe(
            (texts) => {
              this.standardTexts = texts.d.results;
              if (this.standardTexts.length > 0) {
                this.notAvailable = false;
                this.noData = false;
              }
              else {
                this.notAvailable = false;
                this.noData = true;
              }
            });
        }
      })
  }

}
