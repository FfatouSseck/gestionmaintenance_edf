import { Component, OnInit, Input } from '@angular/core';
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
      }
    )
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

  getParts(){
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

  getCalbs(){
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

}
