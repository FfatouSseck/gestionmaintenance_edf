import { Component, OnInit, Input } from '@angular/core';
import { MaterialService } from 'src/app/providers/material.service';
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-component-details',
  templateUrl: './component-details.page.html',
  styleUrls: ['./component-details.page.scss'],
})
export class ComponentDetailsPage implements OnInit {
  @Input() mode: string;
  @Input() cp: any;
  componentList: any[]=[];
  loadingData = true;
  noData = false;
  choosenPlant: string;
  searching: any = false;
  searchTerm: string = '';
  searchControl: FormControl;

  constructor(private materialService: MaterialService,private storage: Storage,
              private modalController: ModalController) {
    this.searchControl = new FormControl();

    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
   }

  ngOnInit() {
  
  }

  ionViewDidEnter(){
    this.loadingData = true;
    this.noData = false;
    this.storage.get("choosenPlant").then(
      (choosenPlant)=>{
        if(choosenPlant != null && choosenPlant != undefined && choosenPlant !== ""){
          this.choosenPlant = choosenPlant;
          this.displayData();
        }
      }
    )
  }

  setFilteredItems(){
    this.componentList = this.filterComponents();
  }

  filterComponents(){
    return this.componentList.filter(
      (cp)=>{
        return (cp.MaterialId.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 
            || cp.MaterialDescr.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          )
      }
    )
  }

  choose(cp){
    this.modalController.dismiss({
      'result': cp
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  displayData(){
    if(this.mode != null && this.mode != undefined){
      if(this.mode === 'create'){
        this.materialService.getMaterialByPlant(this.choosenPlant).subscribe(
          (materials) =>{
            if(materials != null && materials != undefined){
              this.componentList = materials.d.results;

              if(this.componentList.length > 0){
                this.loadingData = false;
                this.noData = false;
              }
              else{
                this.loadingData = false;
                this.noData = true;
              }
            }
          }
        )
      }
      else if(this.mode === 'detail'){

      }
    }
  }

}
