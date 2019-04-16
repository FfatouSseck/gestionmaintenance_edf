import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { MockService } from 'src/app/providers/mock.service';
import { Storage } from '@ionic/storage';
import { EmployeeService } from 'src/app/providers/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {

  employeeList: any[]=[];
  notAvailable = true;
  noData = false;
  searching: any = false;
  searchTerm: string = '';
  searchControl: FormControl;

  constructor(public modalController: ModalController,private mockService: MockService,
              private storage: Storage, private employeeService: EmployeeService) {
    this.searchControl = new FormControl();
    
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
   }

   setFilteredItems(){
    this.employeeList = this.filterEmployees();
  }

  filterEmployees(){
    return this.employeeList.filter(
      (em) =>{
        return (em.PersonNo.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
             || em.UserFullName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
      })
  }

  
  choose(em){
    this.modalController.dismiss({
      'result' : em
    });
  }

  onSearchInput(){
    this.searching = true;
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

  ionViewDidEnter(){
    this.notAvailable = true;
    this.storage.get("mock").then(
      (mock)=>{
        if (mock != null && mock != undefined && mock == true) {
          this.employeeList = this.mockService.getMockEmployees();
          if(this.employeeList.length>0){
            this.notAvailable = false;
            this.noData = false;
          }
          else{
            this.notAvailable = false;
            this.noData = true;
          }
        }
        else{
          this.employeeService.getAllEmployees().subscribe(
            async (emp)=>{
              this.employeeList = emp.d.results;
              if(this.employeeList.length>0){
                this.notAvailable = false;
                this.noData = false;
              }
              else{
                this.notAvailable = false;
                this.noData = true;
              }
            },
            (err)=>{
    
            }
          )
        }
      }
    )

  }

}
