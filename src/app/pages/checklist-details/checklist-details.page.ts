import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MockService } from 'src/app/providers/mock.service';
import { ModalController } from '@ionic/angular';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-checklist-details',
  templateUrl: './checklist-details.page.html',
  styleUrls: ['./checklist-details.page.scss'],
})
export class ChecklistDetailsPage implements OnInit {
  step = 0;
  @Input() orderNo: string;
  @Input() plant: string;
  @ViewChild('tabGroup') tabGroup;
  @ViewChild('tabGroup2') tabGroup2;
  @ViewChild('tabGroup3') tabGroup3;
  mock = false;
  equipments: any;
  noEquipments = false;
  loadingEquipments = true;
  displayedEQColumns: string[] = ['Equipement', 'Description', 'Quantity', 'Checked'];

  parts: any;
  noParts = false;
  loadingParts = true;
  displayedPartsColumns: string[] = ['Material', 'Description', 'Quantity', 'Picked'];

  calbs: any;
  noCalbs = false;
  loadingCalbs = true;
  displayedCalbsColumns: string[] = ['Tool', 'Comment', 'SerialNumber', 'InternRefCode', 'Remove'];

  checklists: any;
  initialChecklists: any;
  noChecklists = false;
  loadingChecklists = true;
  displayedChecklistsColumns: string[] = ['col1', 'col2', 'col3', 'col4', 'col5'];
  pathSecondLevel = "All Tasks";
  pathThirdLevel = "";
  pathFourthLevel = "";
  secondLevellabels: string[] = [];
  thirdLevelLabels: string[] = [];
  fourthLevelLabels: string[] = [];
  level = 2;

  constructor(private mockService: MockService, private storage: Storage, private modalController: ModalController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null && mock == true) {
          this.mock = mock;
        }
        this.getTools();
        this.getParts();
        this.getCalbs();
        this.getSecondLevelChecklists();
      }
    )
  }

  segmentChanged(event: any, pathSecondLevel?) {
    if (pathSecondLevel != null && pathSecondLevel !== undefined) {
      this.pathSecondLevel = pathSecondLevel;
    }
    else this.pathSecondLevel = this.secondLevellabels[this.tabGroup.selectedIndex];
    this.getSecondLevelChecklists();
    if (this.pathSecondLevel !== 'All Tasks') {
      this.thirdLevelLabels = this.getThirdLevelLabels(this.pathSecondLevel);
      this.pathThirdLevel = this.thirdLevelLabels[0];
      this.getThirdLevelChecklists(this.pathSecondLevel, this.pathThirdLevel);
    }
  }


  segmentLevel2Changed(ev: any) {
    this.pathThirdLevel = this.thirdLevelLabels[this.tabGroup2.selectedIndex];
    this.getThirdLevelChecklists(this.pathSecondLevel, this.pathThirdLevel);
    this.fourthLevelLabels = this.getFourthLevelLabels(this.pathSecondLevel, this.pathThirdLevel);
    this.pathFourthLevel = this.fourthLevelLabels[0];
    this.getFourthLevelChecklists(this.pathSecondLevel, this.pathThirdLevel, this.pathFourthLevel);
  }

  segmentLevel3Changed(ev: any) {
    this.pathFourthLevel = this.fourthLevelLabels[this.tabGroup3.selectedIndex];
    this.getFourthLevelChecklists(this.pathSecondLevel, this.pathThirdLevel, this.pathFourthLevel);
  }

  goBack(level: number) {
    if (level == 2) {
      this.segmentChanged(null, 'All Tasks');
    }
    else if (level == 3) {
        this.segmentLevel2Changed(null);

    }
    else if (level == 4) {
        this.segmentLevel3Changed(null);
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  getTools() {
    if (this.mock) {
      let eq = this.mockService.getMockOrderOpChckToolSetByOrderNo(this.orderNo, this.plant);
      if (eq.length > 0) {
        this.loadingEquipments = false;
        this.noEquipments = false;
        this.equipments = new MatTableDataSource(eq);
      }
      else {
        this.loadingEquipments = false;
        this.noEquipments = true;
      }
    }
  }

  getParts() {
    if (this.mock) {
      let pts = this.mockService.getMockOrderOperationChecklistPartSet(this.orderNo, this.plant);
      if (pts.length > 0) {
        this.loadingParts = false;
        this.noParts = false;
        this.parts = new MatTableDataSource(pts);
      }
      else {
        this.loadingParts = false;
        this.noParts = true;
      }
    }
  }

  getCalbs() {
    if (this.mock) {
      let cbs = this.mockService.getMockOrderOperationChecklistCalbSet(this.orderNo, this.plant);
      if (cbs.length > 0) {
        this.loadingCalbs = false;
        this.noCalbs = false;
        this.calbs = new MatTableDataSource(cbs);
      }
      else {
        this.loadingCalbs = false;
        this.noCalbs = true;
      }
    }
  }

  getCount(label) {
    if (this.level == 2) {
      if (label === 'All Tasks') {
        return label + "(" + this.initialChecklists.data.length + ")";
      }
      else return label + "(" + this.initialChecklists.data.filter(x => x.ChklstLoc2 === label).length + ")";
    }
    else if (this.level == 3) {
      return label + "(" + this.initialChecklists.data.filter(x => x.ChklstLoc3 === label).length + ")";
    }
    else if (this.level == 4) {
      return label + "(" + this.initialChecklists.data.filter(x => x.ChklstLoc4 === label).length + ")";
    }
  }

  getSecondLevelChecklists() {
    this.level = 2;
    if (this.mock) {
      let elts = this.mockService.getMockOrderOperationChecklistTaskSet(this.orderNo, this.plant);
      if (elts.length > 0) {
        this.secondLevellabels = this.getSecondLevelLabels(elts);
        this.secondLevellabels.unshift("All Tasks");
      }
      if (this.pathSecondLevel === 'All Tasks') {
        let ckl = elts;
        if (ckl.length > 0) {
          this.loadingChecklists = false;
          this.noChecklists = false;
          this.checklists = new MatTableDataSource(ckl);
          this.initialChecklists = this.checklists;
        }
        else {
          this.loadingChecklists = false;
          this.noChecklists = true;
        }
      }
      else {
        let ckl = this.initialChecklists.data.filter(ck => ck.ChklstLoc2 === this.pathSecondLevel);
        this.checklists = new MatTableDataSource(ckl);
      }
    }
  }

  getThirdLevelChecklists(level2Label, level3Label) {
    this.level = 3;
    let ckl = this.initialChecklists.data.filter(ck =>
      (ck.ChklstLoc2.toLowerCase() === level2Label.toLowerCase() &&
        ck.ChklstLoc3.toLowerCase() === level3Label.toLowerCase())
    );
    this.checklists = new MatTableDataSource(ckl);
  }

  getFourthLevelChecklists(level2Label: string, level3Label: string, level4Label: string) {
    this.level = 4;
    let ckl = this.initialChecklists.data.filter(ck =>
      (ck.ChklstLoc2.toLowerCase() === level2Label.toLowerCase() &&
        ck.ChklstLoc3.toLowerCase() === level3Label.toLowerCase() &&
        ck.ChklstLoc4.toLowerCase() === level4Label.toLowerCase())
    );
    this.checklists = new MatTableDataSource(ckl);
  }

  getSecondLevelLabels(tab: any[]) {
    let labels: string[] = [];
    for (let i = 0; i < tab.length; i++) {
      labels.push(tab[i].ChklstLoc2);
    }
    return this.getUnique(labels);
  }

  getThirdLevelLabels(firstLevelLabel: string) {
    this.level = 2;
    let secondLevel: string[] = [];

    this.initialChecklists.data.forEach(function (ckl) {
      if (ckl.ChklstLoc2.toLowerCase().indexOf(firstLevelLabel.toLowerCase()) > -1) {
        secondLevel.push(ckl.ChklstLoc3);
      }
    });
    return this.getUnique(secondLevel);
  }

  getFourthLevelLabels(secondLevelLabel, thirdLevelLabel) {
    this.level = 4;
    let fourthLevelTab: string[] = [];

    this.initialChecklists.data.forEach(function (ckl) {
      if (ckl.ChklstLoc2.toLowerCase() === secondLevelLabel.toLowerCase() &&
        ckl.ChklstLoc3.toLowerCase() === thirdLevelLabel.toLowerCase()
      ) {
        fourthLevelTab.push(ckl.ChklstLoc4);
      }
    });
    return this.getUnique(fourthLevelTab);
  }

  getUnique(arr: string[]) {
    return arr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

}
