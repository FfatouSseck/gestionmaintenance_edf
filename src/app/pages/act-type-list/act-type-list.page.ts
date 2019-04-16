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
        return (act.ActivityType.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          || act.ActivityTypeDescr.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
      })
  }

  ionViewDidEnter() {
    this.notAvailable = true;
    if (this.workCenter != undefined) {
      if (this.plant != undefined) {
        this.storage.get("mock").then(
          (mock) => {
            if (mock != undefined && mock != null && mock == true) {
              this.actList = this.mockService.getMockActTypes(this.plant, this.workCenter);
              console.log("activities: ",this.actList);
              if(this.actList.length>0){
                this.notAvailable = false;
                this.noData = false;
              }
              else{
                this.notAvailable = false;
                this.noData = true;
              }
              
            }
            else {//no mock
              this.actService.getAllActTypesByPlantAndWorkCenter(this.plant, this.workCenter)
                      .subscribe(
                        (acts) => {
                          console.log("activities: ", acts.d.results);
                          this.actList = acts.d.results;
                          if(this.actList.length>0){
                            this.notAvailable = false;
                            this.noData = false;
                          }
                          else{
                            this.notAvailable = false;
                            this.noData = true;
                          }
                        },
                        (err) => {

                        })
            }
          })
      }
    }
  }

}
