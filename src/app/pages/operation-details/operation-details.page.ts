import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-operation-details',
  templateUrl: './operation-details.page.html',
  styleUrls: ['./operation-details.page.scss'],
})
export class OperationDetailsPage implements OnInit {
  @Input() op:any;
  operations: any[] = [];
  displayedColumns: string[] = ['Operation', 'Description', 'Plant',
                                'WorkCenter','ActType','Duration','NumEmp'];
  dataSource: any;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    console.log(this.op);
    this.operations.push(this.op);
    this.dataSource = new MatTableDataSource(this.operations);
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
