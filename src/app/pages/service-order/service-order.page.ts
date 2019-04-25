import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { MockService } from 'src/app/providers/mock.service';
import { ServiceOrderService } from 'src/app/providers/service-order.service';
import { Storage } from '@ionic/storage';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Order } from 'src/app/interfaces/order.interface';

@Component({
  selector: 'app-service-order',
  templateUrl: './service-order.page.html',
  styleUrls: ['./service-order.page.scss'],
})
export class ServiceOrderPage implements OnInit {

  searchControl: FormControl;
  @ViewChild('search') search: any;
  @ViewChild('select') select;
  clicked = false;
  refresh = false;
  searchTerm: string = '';
  soList = [];
  serviceOrders = [];
  notAvailable = true;
  noData = false;
  orientation = "landscape-primary";
  types: any[] = [];
  defaultFilter: string = '';

  constructor(private mockService: MockService, private orderService: ServiceOrderService,
    private storage: Storage, private orderPreparationService: ServiceOrderPreparationService,
    private router: Router, private screenOrientation: ScreenOrientation) {

    this.orientation = this.screenOrientation.type;
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        this.orientation = this.screenOrientation.type;
      });
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {
      this.setFilteredItems();
    });
  }

  ngOnInit() {
    this.getAllSOs();
  }

  sortBy(option) {
    if (option === 'mySOs') {
      this.soList = this.getMySOs();
    }
    else
      if (option === 'veryHigh') {
        this.soList = this.getSOsByPriority('1');
      }
      else
        if (option === 'high') {
          this.soList = this.getSOsByPriority('2');
        }
        else
          if (option === 'medium') {
            this.soList = this.getSOsByPriority('3');
          }
          else
            if (option === 'allOrders') {
              this.soList = this.serviceOrders;
            }
            else {//orderTypes
              this.soList = this.getSOsByOrderType(option);
            }
  }

  getMySOs() {
    return this.serviceOrders.filter(
      (so) => {
        return so.Mine == true;
      }
    )
  }

  getSOsByOrderType(ord) {
    return this.serviceOrders.filter(
      (so) => {
        return so.OrderType === ord;
      }
    )
  }

  getSOsByPriority(pr: string) {
    if (pr === '1') {
      return this.serviceOrders.filter(
        (so) => {
          return so.Priority === "1";
        }
      )
    }
    else
      if (pr === '2') {
        return this.serviceOrders.filter(
          (so) => {
            return so.Priority === "2";
          }
        )
      }
      else
        if (pr === '3') {
          return this.serviceOrders.filter(
            (so) => {
              return so.Priority === "3";
            }
          )
        }
        else
          if (pr === '4') {
            return this.serviceOrders.filter(
              (so) => {
                return so.Priority === "4";
              }
            )
          }
  }

  sortAlphaNumeric = (a, b) => {
    // convert to strings and force lowercase
    a = typeof a === 'string' ? a : a.toString();
    b = typeof b === 'string' ? b : b.toString();

    return a.localeCompare(b);
  };

  getAllSOs() {
    this.storage.get("choosenPlant").then(
      (plant) => {
        if (plant != undefined && plant != null && plant !== "") {
          this.storage.get("mock").then(
            (mock) => {
              if (mock != null && mock != undefined && mock == true) {
                this.soList = this.mockService.getAllMockSO(plant);
                this.serviceOrders = this.soList;
                if (this.soList.length > 0) {
                  this.notAvailable = false;
                  this.noData = false;
                  this.orderPreparationService.setOrders(this.soList);
                  let types = this.getOrderTypes(this.soList);
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
                else {
                  this.notAvailable = false;
                  this.noData = true;
                }
              }
              else {
                this.orderService.getAllOrdersByChoosenPlant(plant).subscribe(
                  (orders) => {
                    this.soList = orders.d.results;
                    this.serviceOrders = this.soList;
                    if (this.soList.length > 0) {
                      this.notAvailable = false;
                      this.noData = false;
                      this.orderPreparationService.setOrders(this.soList);
                      let types = this.getOrderTypes(this.soList);
                      let types2 = this.getUnique(types);
                      types2.sort(this.sortAlphaNumeric)

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
                    else {
                      this.notAvailable = false;
                      this.noData = true;
                    }
                  }
                )
              }
            }
          )
        }
      }
    )
  }

  openSelect(evt) {
    this.select.open();
  }

  setFilteredItems() {
    this.soList = this.orderPreparationService.filterOrders(this.searchTerm);
  }

  getOrderTypes(arr: Order[]) {
    let types: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      types.push(arr[i].OrderType);
    }
    return types;
  }

  getUnique(arr: string[]) {
    return arr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
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

  doRefresh(event) {
    this.refresh = true;
    this.getAllSOs();

    setTimeout(() => {
      event.target.complete();
      this.refresh = false;
    }, 3000);
  }

  presentDetails(order) {
    let index = this.soList.indexOf(order);
    for (let i = 0; i < this.soList.length; i++) {
      this.soList[i].bgcolor = "white";
    }

    this.soList[index].bgcolor = "#F7F7F7";
    this.orderPreparationService.setCurrentOrder(order);
    this.router.navigateByUrl("/order-details");
  }

  onClose(evt) {
    this.notAvailable = true;
    this.getAllSOs();
  }

}
