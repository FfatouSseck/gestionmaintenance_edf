import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CheckListAssignmentService } from 'src/app/providers/check-list-assignment.service';
import { MockService } from 'src/app/providers/mock.service';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  checklists: any[] = [];
  noData = false;
  loading = true;
  displayedColumns: string[] = ['id', 'title', 'creationDate'];
  dataSource: any;
  searchTerm = "";
  searchControl: FormControl;

  constructor(private storage: Storage, private checklistService: CheckListAssignmentService,
    private mockService: MockService) {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {

      this.setFilteredItems();

    });

  }

  setFilteredItems(){
    this.checklists = this.checklistService.filterItems(this.searchTerm);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storage.get("choosenPlant").then(
      (plant) => {
        if (plant != null && plant != undefined && plant !== "") {

          this.storage.get("mock").then(
            (mock) => {
              if (mock != null && mock != undefined && mock == true) {
                this.checklists = this.mockService.getMockCheckListByPlant(plant);
                if (this.checklists.length == 0) {
                  this.loading = false;
                  this.noData = true;
                }
                else {
                  this.loading = false;
                  this.noData = false;
                  this.dataSource = new MatTableDataSource(this.checklists);
                }
              }
              else {
                this.checklistService.getChecklistsByPlant(plant).subscribe(
                  (checklists) => {
                    console.log(checklists.d.results);
                    this.checklists = checklists.d.results;
                    if (this.checklists.length == 0) {
                      this.loading = false;
                      this.noData = true;
                    }
                    else {
                      this.loading = false;
                      this.noData = false;
                      this.dataSource = new MatTableDataSource(this.checklists);
                    }
                  })
              }
            })
        }
      }
    )

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
