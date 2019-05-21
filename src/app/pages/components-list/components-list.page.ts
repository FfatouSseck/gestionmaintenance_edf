import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-components-list',
  templateUrl: './components-list.page.html',
  styleUrls: ['./components-list.page.scss'],
})
export class ComponentsListPage implements OnInit {
  @Input() components: any;
  dataSource: any;
  updatedComponents: any[] = [];
  displayedColumns: string[] = ['Materialnumber', 'Materialdescription', 'Valuation', 'Plannedquantity',
    'Quant', 'Prevwithdrawn', 'Remainingquantity', 'Unit'];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.components);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  addToCopy(index: number, event) {
    console.log("event: ", event);

    //this.updatedComponents.push(this.components[index]);
  }

  submitComponents() {
    console.log("components to submit: ", this.updatedComponents);
  }

  removeWithdrawnQuantity(index: number) {
    console.log(this.dataSource.data);
  }

  addWithdrawnQuantity(index: number) {
    console.log(this.dataSource.data);
  }

  float2int(value) {
    var num = +value;
    return num | 0;
  }

}
