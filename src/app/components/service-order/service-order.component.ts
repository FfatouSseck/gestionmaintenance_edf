import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { MockService } from 'src/app/providers/mock.service';
import { ServiceOrderService } from 'src/app/providers/service-order.service';
import { Storage } from '@ionic/storage';
import { ServiceOrderPreparationService } from 'src/app/providers/service-order-preparation.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/interfaces/order.interface';

@Component({
  selector: 'service-order',
  templateUrl: './service-order.component.html',
  styleUrls: ['./service-order.component.scss'],
})
export class ServiceOrderComponent implements OnInit {

  searchControl: FormControl;
  @ViewChild('search') search: any;
  clicked = false;
  refresh = false;
  searchTerm: string = '';
  soList = [];
  serviceOrders = [];
  notAvailable = true;
  noData = false;
  types: any[] = [];
  defaultFilter: string = '';
  currentUrl = "";

  constructor(public mockService: MockService, public orderService: ServiceOrderService,
    public storage: Storage, public orderPreparationService: ServiceOrderPreparationService,
    public router: Router) {

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe(search => {
      this.setFilteredItems();
    });
  }

  ngOnInit() {
    this.currentUrl = this.router.url; 
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
    console.log("current URL: ",this.currentUrl);
    
    this.orderPreparationService.setCurrentOrder(order);
    if(this.currentUrl === '/service-order')
      this.router.navigateByUrl("/order-details");
    else // for time and material confirmation
    { 
      this.orderPreparationService.setCurrentOrigin(this.currentUrl);
      this.router.navigateByUrl("/order-details");
    }
  }

  onClose(evt) {
    this.notAvailable = true;
    this.getAllSOs();
  }


}
