import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.page.html',
  styleUrls: ['./create-notification.page.scss'],
})
export class CreateNotificationPage implements OnInit {

  notifFormGroup: FormGroup;
  locations: Location[] = [
    {loc: 'CAT', description: 'Catalina Solar -Structure *DO NOT USE*'},
    {loc: 'CAT2', description: 'Catalina Solar 2 - Structure - D N U'},
    {loc: 'MTS1', description: 'Mojave Test Facility - Structure DNU'},
    {loc: 'SUN', description: 'Sun Harvest LLC -Structure *DO NOT USE'}
  ];
  productionEffects = [
    {id: 1,desc:'No effect'},
    {id: 2,desc:'Production Breakdown'},
    {id: 3,desc:'Production Restricted'}
  ]
  priorities = [
    {id:1,desc:'Very High'},
    {id:2,desc:'High'},
    {id:3,desc:'Medium'},
    {id:4,desc:'Low'}
  ]
  today = new Date();
  dateauj = "";

  constructor(private _formBuilder: FormBuilder) {
    let m = this.today.getMonth()+1;
    let min = this.today.getMinutes();
    let minutes="";
    let month = "";

    if(m.toString().length<2) {
      month = "0"+m;
    }else month=m.toString();

    if(min.toString().length<2){
      minutes = "0"+min;
    }else minutes=min.toString();
    
    this.dateauj=this.today.getDate()+"/"+month+"/"+this.today.getFullYear()+" "+this.today.getHours()+":"+minutes;
    console.log(this.today.getDate()+"/"+month+"/"+this.today.getFullYear()+" "+this.today.getHours()+":"+minutes);
   
  }

  ngOnInit() {
    this.notifFormGroup = this._formBuilder.group({
      description: ['', Validators.required],
      functloc: ['', Validators.required],
      equipment: ['', Validators.required],
      productionEff: ['', Validators.required],
      priority: ['', Validators.required],
      startDate: ['', Validators.required],
      damageCode: ['', Validators.required],
      cause: ['', Validators.required],
      objectPart: ['', Validators.required],
      longText: ['']
    });
  }

}

export interface Location {
  loc: string;
  description: string;
}

