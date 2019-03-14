import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { CauseCode } from 'src/app/interfaces/causecode.interface';
import { CausecodeService } from 'src/app/providers/causecode.service';


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

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public causeCodeService: CausecodeService) {

    this.causeGroup = navParams.get('cg');

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {

      this.setFilteredItems();

    });
  }

  ngOnInit() {
  }

  setFilteredItems() {
    this.causeCodes = this.causeCodeService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    //getting CauseGroupSet from server
      this.causeCodes = [];
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

  closeModal() {
    this.modalController.dismiss();
  }

  choose(cc) {
    this.modalController.dismiss({
      'result': cc
    });
  }

}
