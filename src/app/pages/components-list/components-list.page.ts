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
    if(this.components != null && this.components != undefined && this.components.length > 0){
      for(let i=0;i<this.components.length;i++){
        this.components[i].WithdrawnQuantity =  this.float2int(this.components[i].WithdrawnQuantity);
      }
      this.dataSource = new MatTableDataSource(this.components);
    }
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
    let withQu = this.dataSource.data[index].WithdrawnQuantity;
    if (withQu>0) withQu--;
    this.dataSource.data[index].WithdrawnQuantity = withQu;
    if(this.checkIfExists(this.dataSource.data[index]) == false){
      this.updatedComponents.push(this.dataSource.data[index]);
    }
  }

  addWithdrawnQuantity(index: number) {
    let withQu = this.dataSource.data[index].WithdrawnQuantity;
    withQu++;
    this.dataSource.data[index].WithdrawnQuantity = withQu;
    if(this.checkIfExists(this.dataSource.data[index]) == false){
      this.updatedComponents.push(this.dataSource.data[index]);
    }
  }

  float2int(value) {
    var num = +value;
    return num | 0;
  }

  checkIfExists(elt){
    for(let i=0;i<this.updatedComponents.length;i++){
      if(this.updatedComponents[i].Material === elt.Material){
        return true;
      }
    }
    return false;
  }

}
