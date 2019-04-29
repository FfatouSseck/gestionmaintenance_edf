import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { MyOrdersService } from 'src/app/providers/my-orders.service';
import { MockService } from 'src/app/providers/mock.service';
import { Storage } from '@ionic/storage';
import { Order } from 'src/app/interfaces/order.interface';

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

  constructor(private myOrdersService: MyOrdersService, private mockService: MockService, private storage: Storage) {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {
      this.filterOrders();
    });
  }

  ngOnInit() {
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
        lib: 'My Service Orders',
        val: 'mySOs'
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
  }

  setFilteredItems() {
    if (this.mock) {
      this.mySoList = this.mockService.getAllMyMockSO(this.choosenPlant);
      if (this.mySoList.length > 0) {
        this.notAvailable = false;
        this.noData = false;
        this.myOrdersService.setSOs(this.mySoList)
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
