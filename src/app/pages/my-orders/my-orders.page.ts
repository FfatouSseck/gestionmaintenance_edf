import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { MyOrdersService } from 'src/app/providers/my-orders.service';
import { MockService } from 'src/app/providers/mock.service';
import { Storage } from '@ionic/storage';
import { Order } from 'src/app/interfaces/order.interface';
import { Router } from '@angular/router';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
  searchControl: FormControl;
  @ViewChild('search') search: any;
  clicked = false;
  refresh = false;
  searchTerm: string = '';
  mySoList: any[] = [];
  types: any[] = [];
  mock = false;
  choosenPlant = "";
  notAvailable = true;
  noData = false;
  defaultFilter: string = '';
  initialOrders: any[] = [];
  searching: any = false;

  constructor(private myOrdersService: MyOrdersService, private mockService: MockService, private storage: Storage,
              private router: Router,private orderPreparationService: ServiceOrderPreparationService) {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {
      this.searching = false;
      this.filterOrders();
    });
  }

  ngOnInit() {
  }

  onSearchInput() {
    this.searching = true;
  }

  presentDetails(order) {
    this.orderPreparationService.setCurrentOrder(order);
    this.router.navigateByUrl("/order-details");
  }

  onClose(evt) {
    this.notAvailable = true;
    this.setFilteredItems();
  }

  ionViewDidEnter() {
    this.storage.get("mock").then(
      (mock) => {
        if (mock != undefined && mock != null) {
          this.mock = mock;
        }
        this.storage.get("choosenPlant").then(
          (choosenPlant) => {
            if (choosenPlant != undefined && choosenPlant != null) {
              this.choosenPlant = choosenPlant;
              this.setFilteredItems();
            }
          }
        )
      }
    )
  }

  getTypes() {
    let types = this.getOrderTypes(this.mySoList);
    let types2 = this.getUnique(types);
    types2.sort(this.sortAlphaNumeric);

    this.types.push(
      {
        lib: 'All Orders',
        val: 'allOrders'
      },
      {
        lib: 'Very High',
        val: 'veryHigh'
      },
      {
        lib: 'High',
        val: 'high'
      },
      {
        lib: 'Medium',
        val: 'medium'
      });
    types2.forEach(type => {
      this.types.push({
        lib: type,
        val: type
      })
    });
    this.types.forEach((element) => {
      if (element.val === 'allOrders') {
        this.defaultFilter = element.val;
      }
    });
  }


  getUnique(arr: string[]) {
    return arr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  sortBy(option){
    if (option === 'allOrders') {
      this.mySoList = this.initialOrders;
    }
    else
      if (option === 'veryHigh') {
        this.mySoList = this.getSOsByPriority('1');
      }
      else
        if (option === 'high') {
          this.mySoList = this.getSOsByPriority('2');
        }
        else
          if (option === 'medium') {
            this.mySoList = this.getSOsByPriority('3');
          }
            else {//orderTypes
              this.mySoList = this.getSOsByOrderType(option);
            }
  }

  getSOsByOrderType(ord) {
    return this.initialOrders.filter(
      (so) => {
        return so.OrderType === ord;
      }
    )
  }

  getSOsByPriority(pr: string) {
    if (pr === '1') {
      return this.initialOrders.filter(
        (so) => {
          return so.Priority === "1";
        }
      )
    }
    else
      if (pr === '2') {
        return this.initialOrders.filter(
          (so) => {
            return so.Priority === "2";
          }
        )
      }
      else
        if (pr === '3') {
          return this.initialOrders.filter(
            (so) => {
              return so.Priority === "3";
            }
          )
        }
        else
          if (pr === '4') {
            return this.initialOrders.filter(
              (so) => {
                return so.Priority === "4";
              }
            )
          }
  }

  getOrderTypes(arr: Order[]) {
    let types: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      types.push(arr[i].OrderType);
    }
    return types;
  }

  sortAlphaNumeric = (a, b) => {
    // convert to strings and force lowercase
    a = typeof a === 'string' ? a : a.toString();
    b = typeof b === 'string' ? b : b.toString();

    return a.localeCompare(b);
  };

  filterOrders() {
    this.mySoList = this.myOrdersService.filterMySOs(this.searchTerm);
    if(this.mySoList.length > 0){
      this.searching = false;
    }
  }

  setFilteredItems() {
    if (this.mock) {
      this.mySoList = this.mockService.getAllMyMockSO(this.choosenPlant);
      if (this.mySoList.length > 0) {
        this.notAvailable = false;
        this.noData = false;
        this.myOrdersService.setSOs(this.mySoList);
        this.initialOrders = this.mySoList;
        this.getTypes();
      }
      else {
        this.notAvailable = false;
        this.noData = true;
      }
    }
    else {
      this.myOrdersService.getAllMySOsByChoosenPlant(this.choosenPlant).subscribe(
        (SOs) => {
          if (SOs.d.results.length > 0) {
            this.notAvailable = false;
            this.noData = false;
            this.myOrdersService.setSOs(SOs.d.results);
            this.mySoList = this.myOrdersService.getMySOs();
            this.initialOrders = this.mySoList;
            this.getTypes();
          }
          else {
            this.notAvailable = false;
            this.noData = true;
          }
        });
    }
  }

  doRefresh(event) {
    this.refresh = true;
    this.setFilteredItems();

    setTimeout(() => {
      event.target.complete();
      this.refresh = false;
    }, 3000);
  }

  toggleSearch() {
    if (this.clicked) {
      this.clicked = false;
    } else {
      this.clicked = true;
      setTimeout(() => {
        this.search.setFocus();
      }, 100);
    }
  }

}
