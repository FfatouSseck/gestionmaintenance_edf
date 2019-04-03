import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CheckListAssignmentService } from 'src/app/providers/check-list-assignment.service';
import { MockService } from 'src/app/providers/mock.service';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  checklists: any[] = [];
  noData = false;
  notAvailable = true;
  displayedColumns: string[] = ['id', 'title', 'creationDate'];
  dataSource: any;
  searchTerm: string = '';
  searchControl: FormControl;
  searching = false;

  constructor(private storage: Storage, private checklistService: CheckListAssignmentService,
    private mockService: MockService,private modalController: ModalController) {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });

  }

  setFilteredItems() {
    this.dataSource = new MatTableDataSource(this.checklistService.filterItems(this.searchTerm));
  }

  ngOnInit() {
  }

  onSearchInput() {
    this.searching = true;
  }

  ionViewDidEnter() {
    this.noData = false;
    this.storage.get("choosenPlant").then(
      (plant) => {
        if (plant != null && plant != undefined && plant !== "") {

          this.storage.get("mock").then(
            (mock) => {
              if (mock != null && mock != undefined && mock == true) {
                this.checklists = this.mockService.getMockCheckListByPlant(plant);
                if (this.checklists.length == 0) {
                  this.notAvailable = false;
                  this.noData = true;
                }
                else {
                  this.notAvailable = false;
                  this.noData = false;
                  this.dataSource = new MatTableDataSource(this.checklists);
                  this.checklistService.setCheckLists(this.checklists);
                }
              }
              else {
                this.checklistService.getChecklistsByPlant(plant).subscribe(
                  (checklists) => {
                    this.checklists = checklists.d.results;
                    if (this.checklists.length == 0) {
                      this.notAvailable = false;
                      this.noData = true;
                    }
                    else {
                      this.notAvailable = false;
                      this.noData = false;
                      this.dataSource = new MatTableDataSource(this.checklists);
                      this.checklistService.setCheckLists(this.checklists);
                    }
                  })
              }
            })
        }
      }
    )

  }

  closeModal() {
    this.modalController.dismiss();
  }

  chooseChecklist(ck){
    this.modalController.dismiss({
      'result' : ck
    });
  }

  formatDate(newD: string) {

    let d1 = newD.replace('/Date(', '');
    let startDate = d1.replace(')/', '');
    let newDate = new Date(Number(startDate));

    let m = newDate.getMonth() + 1;
    let d = newDate.getDate();
    let month = "";
    let day = "";

    if (m.toString().length < 2) {
      month = "0" + m;
    } else month = m.toString();

    if (d.toString().length < 2) {
      day = "0" + d;
    } else day = d.toString();

    let datec = day + "/" + month + "/" + newDate.getFullYear();
    return datec

  }


}
