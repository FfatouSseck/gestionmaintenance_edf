import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AuthenticationService } from '../../providers/authentication.service';
import { PlantsService } from '../../providers/plants.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Data } from '../../providers/data';
import { NotificationService } from '../../providers/notification.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginFormGroup: FormGroup;
  credentials = {
    login: "",
    pwd: ""
  }
  hide = true;
  orientation = "0";
  formInvalid = false;
  
  constructor(public _formBuilder: FormBuilder,private screenOrientation: ScreenOrientation,
              public loginservice: AuthenticationService,public navCtrl: NavController,
              public plantService: PlantsService,public storage: Storage,public router: Router,
              public dataService: Data, public notifService: NotificationService) { }

  ngOnInit() {
    this.loginFormGroup = this._formBuilder.group({
      login: ['',Validators.required],
      pwd: ['',Validators.required]
    })

    this.orientation = this.screenOrientation.type;
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
          this.orientation = this.screenOrientation.type;
      }
    );
  }

  login(){
    this.formInvalid = false;
    if(!this.loginFormGroup.valid){
      this.formInvalid = true;
    }
    else{
      this.loginservice.login(this.credentials.login,this.credentials.pwd);
    }
  }

  ionViewWillLeave(){
    this.plantService.getAllPlants().subscribe(
      (plts: any) =>{
          this.dataService.setPlants(plts.d.results);
      }
    );
  }

}
