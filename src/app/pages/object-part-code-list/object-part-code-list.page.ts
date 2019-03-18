import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { ObjectPartCode } from 'src/app/interfaces/objectpartcode.interface';
import { ObjectpartcodeService } from 'src/app/providers/objectpartcode.service';

@Component({
  selector: 'app-object-part-code-list',
  templateUrl: './object-part-code-list.page.html',
  styleUrls: ['./object-part-code-list.page.scss'],
})
export class ObjectPartCodeListPage implements OnInit {
  searchTerm: string = '';
  searchControl: FormControl;
  objectPartCodes: ObjectPartCode[] = [];
  objectPartGroup = "";
  notAvailable = true;
  noData = false;

  constructor(public navCtrl: NavController, public modalController: ModalController,
    public snackBar: MatSnackBar, public navParams: NavParams,
    public objectPartCodeService: ObjectpartcodeService) {

    this.objectPartGroup = navParams.get('og');
    console.log("og", this.objectPartGroup);
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {

      this.setFilteredItems();

    });
  }

  ngOnInit() {
  }

  setFilteredItems() {
    this.objectPartCodes = this.objectPartCodeService.filterItems(this.searchTerm);
  }

  ionViewDidEnter() {
    //getting CauseGroupSet from server

    this.objectPartCodeService.getAllObjectPartCodesByGroup(this.objectPartGroup).subscribe(
      (objectPartCodes) => {
        console.log(objectPartCodes.d.results)
        this.objectPartCodeService.setObjectPartCodes(objectPartCodes.d.results);

        if (this.objectPartCodeService.checkAvailability()) {
          this.objectPartCodes = this.objectPartCodeService.getAvailableObjectPartCodes();

          if (this.objectPartCodes.length == 0) {
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
      }
    )
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
