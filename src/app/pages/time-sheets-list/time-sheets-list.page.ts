import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-time-sheets-list',
  templateUrl: './time-sheets-list.page.html',
  styleUrls: ['./time-sheets-list.page.scss'],
})
export class TimeSheetsListPage implements OnInit {
  @Input() confs: any;
  dataSource: any;
  checkedSheets: any[] = [];
  displayedColumns: string[] = ['Check', 'ActType', 'StartDate', 'EndDate', 'Duration', 'Modify', 'Delete', 'Copy'];

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.confs);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  addToCopy(index: number, event) {
    if (event.checked == true && !this.checkIfExists(this.confs[index])) {
      this.checkedSheets.push(this.confs[index]);
    }
    else if(event.checked == false){
      if(this.checkIfExists(this.confs[index])){
        this.checkedSheets.splice(index,1);
      }
    }
  }

  checkIfExists(elt){
    let exists = false;
    for (let i=0;i<this.checkedSheets.length;i++){
      if(elt.ConfNo === this.checkedSheets[i].ConfNo && 
        elt.ConfCounter === this.checkedSheets[i].ConfCounter){
         exists= true;
         break
        }
    }
    return exists;
  }

  copyConfs() {
    console.log("confs to copy: ", this.checkedSheets);
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
