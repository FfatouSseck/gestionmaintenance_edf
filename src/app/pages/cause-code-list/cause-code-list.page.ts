import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { CauseCode } from 'src/app/interfaces/causecode.interface';
import { CausecodeService } from 'src/app/providers/causecode.service';
import { Storage } from '@ionic/storage';
import { MockService } from 'src/app/providers/mock.service';


@Component({
  selector: 'app-cause-code-list',
  templateUrl: './cause-code-list.page.html',
  styleUrls: ['./cause-code-list.page.scss'],
})
export class CauseCodeListPage implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  causeCodes: CauseCode[] = [];
  causeGroup = "";
  notAvailable = true;
  mock = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public causeCodeService: CausecodeService,private mockService: MockService,private storage: Storage,) {

    this.causeGroup = navParams.get('cg');

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
    this.causeCodes = this.causeCodeService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    //getting CauseGroupSet from server
      this.causeCodes = [];
      this.getCauseCodes(this.causeGroup);
  }

  getCauseCodes(causeGroup){
    if(this.mock){
      this.causeCodeService.setCauseCodes(this.mockService.getMockCC(causeGroup));
      this.causeCodes = this.causeCodeService.getAvailableCausecodes();
          if(this.causeCodes.length==0){
            this.notAvailable = true;
          }
          else this.notAvailable=false;
    }
    else{
      this.causeCodeService.getAllCauseCodesByGroup(this.causeGroup).subscribe(
        (causeCodes) => {
          console.log(causeCodes.d.results);
          this.causeCodeService.setCauseCodes(causeCodes.d.results);
          this.causeCodes = this.causeCodeService.getAvailableCausecodes();
          if(this.causeCodes.length==0){
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

  choose(cc) {
    this.modalController.dismiss({
      'result': cc
    });
  }

}
