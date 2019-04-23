import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { StandardTextService } from 'src/app/providers/standard-text.service';
import { MockService } from 'src/app/providers/mock.service';
import { StandardTextListPage } from '../standard-text-list/standard-text-list.page';
import { WorkCenterService } from 'src/app/providers/work-center.service';
import { WorkCenterListPage } from '../work-center-list/work-center-list.page';
import { ActTypeService } from 'src/app/providers/act-type.service';
import { EmployeeListPage } from '../employee-list/employee-list.page';
import { ActTypeListPage } from '../act-type-list/act-type-list.page';
import { EmployeeService } from 'src/app/providers/employee.service';
import { ChecklistPage } from '../checklist/checklist.page';
import { ChecklistDetailsPage } from '../checklist-details/checklist-details.page';

@Component({
  selector: 'app-operation-details',
  templateUrl: './operation-details.page.html',
  styleUrls: ['./operation-details.page.scss'],
})
export class OperationDetailsPage implements OnInit {
  @Input() op: any;
  @Input() mode: string; //detail or create
  displayedColumns: string[] = ['Operation', 'Description', 'Plant',
    'WorkCenter', 'ActType', 'Duration', 'NumEmp'];
  dataSource: any;
  operationFormGroup: FormGroup;
  modal: any;
  mock = false;
  standardText = "";
  plant = "";
  workCenter = "";
  assignee = "";
  actType = "";
  checkList = "";

  constructor(public modalController: ModalController, public _formBuilder: FormBuilder,
    private storage: Storage, private mockService: MockService, public workcenterService: WorkCenterService,
    private standardTextService: StandardTextService, private actTypeService: ActTypeService,
    private employeeService: EmployeeService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.storage.get("mock").then(
      (mock) => {
        if (mock != null && mock != undefined) {
          this.mock = mock;
        }
      }
    )
    this.operationFormGroup = this._formBuilder.group({
      operation: ['', Validators.required],
      description: [''],
      standardText: ['', Validators.required],
      plant: ['', Validators.required],
      workCenter: ['', Validators.required],
      assignee: [''],
      actType: ['', Validators.required],
      duration: ['', Validators.required],
      numEmployees: ['', Validators.required],
      checklist: [''],
    });
    console.log("mode: ", this.mode, "operation: ", this.op);
    if (this.mode === 'create') {
      this.op = {
        Activity: "",
        ActivityType: "",
        ActivityTypeDescr: "",
        Assignee: "",
        AssigneeName: "",
        Calbs: undefined,
        ChklstId: "",
        ChklstTitle: "",
        Complete: false,
        Components: undefined,
        Confirmations: undefined,
        Description: "",
        Duration: "0.0",
        DurationUnit: "",
        NumberOfCapacities: 0,
        OrderNo: "",
        Parts: undefined,
        PlanPlant: "",
        PlanPlantDescr: "",
        Plant: "",
        PlantDescr: "",
        ProductionStartDate: "",
        StandardTextDescr: "",
        StandardTextKey: "",
        Tasks: undefined,
        Tools: undefined,
        WorkCenter: "",
        WorkCenterDescr: "",
        WorkCenterShort: "",
        WorkForecast: ""
      };
    }
    else {

      if (this.op.WorkCenterShort !== "") {
        this.workCenter = this.op.WorkCenterShort;
        if (this.op.WorkCenterDescr !== "") {
          this.workCenter += " - " + this.op.WorkCenterDescr;
        }
      }

      if (this.op.StandardTextKey !== "") {
        this.standardText = this.op.StandardTextKey;
        if (this.op.StandardTextDescr !== "") {
          this.standardText += " - " + this.op.StandardTextDescr;
        }
      }

      if (this.op.Assignee !== "") {
        this.assignee += this.op.Assignee;
        if (this.op.AssigneeName !== "") {
          this.assignee += " - " + this.op.AssigneeName;
        }
      }

      if (this.op.ActivityType !== "") {
        this.actType += this.op.ActivityType;
        if (this.op.ActivityTypeDescr !== "") {
          this.actType += " - " + this.op.ActivityTypeDescr;
        }
      }

      if (this.op.ChklstId !== "") {
        this.checkList = this.op.ChklstId;
        if (this.op.ChklstTitle !== "") {
          this.checkList += " - " + this.op.ChklstTitle;
        }
      }

    }
    this.getPlant();
  }

  getPlant() {
    this.storage.get("choosenPlant").then(
      (plt) => {
        if (plt != null && plt != undefined) {
          this.op.Plant = plt;
          this.op.PlanPlant = plt;
          this.plant = this.op.Plant;
        }
      });
    this.storage.get("choosenPlantDescr").then(
      (pltDescr) => {
        if (pltDescr != null && pltDescr != undefined) {
          this.op.PlanPlantDescr = pltDescr;
          this.plant += " - " + this.op.PlanPlantDescr;
        }
      })
  }

  closeModal() {
    this.modalController.dismiss();
  }

  inc() {
    this.op.NumberOfCapacities++;
  }

  dec() {
    if (this.op.NumberOfCapacities > 0)
      this.op.NumberOfCapacities--;
  }

  incDuration() {
    if (this.op.Duration !== '') {
      let dur: number = +this.op.Duration;
      dur += 0.5;
      this.op.Duration = "" + Number(dur).toFixed(1);
    }
    else {
      this.op.Duration = "" + 0.5;
    }
  }

  decDuration() {
    if (this.op.Duration !== "") {
      let dur = +this.op.Duration;
      if (dur > 0) {
        dur -= 0.5;
        this.op.Duration = "" + Number(dur).toFixed(1);
      }
    }
    else {
      this.op.Duration = "" + 0.0;
    }
  }

  async selectStandardText() {

    this.modal = await this.modalController.create({
      component: StandardTextListPage,
      componentProps: {
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.op.StandardTextKey = data.result.StandardTextKey;
      this.op.StandardTextDescr = data.result.ShortText;
      if (this.op.StandardTextKey !== "") {
        this.standardText = this.op.StandardTextKey;
        if (this.op.StandardTextDescr !== "") {
          this.standardText += " - " + this.op.StandardTextDescr;
        }
      }
    }
  }

  async selectAssignee() {
    this.modal = await this.modalController.create({
      component: EmployeeListPage,
      componentProps: {
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.op.Assignee = data.result.PersonNo;
      this.op.AssigneeName = data.result.UserFullName;
      if (this.op.Assignee !== "") {
        this.assignee = this.op.Assignee;
        if (this.op.AssigneeName !== "") {
          this.assignee += " - " + this.op.AssigneeName;
        }
      }
    }

  }

  async selectActType() {

    if (this.workCenter === "") {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Please choose a work center first',
        buttons: ['OK']
      });
      await alert.present();

    }
    else {

      if (this.mode === 'detail') {
        //ici on instancie la popup en lui disant quel contenu afficher
        this.modal = await this.modalController.create({
          component: ActTypeListPage,/*ceci est une page qu'on a créé
      avec la cde ionic g page nomDeLaPage*/
          componentProps: {
            'plant': this.op.Plant,
            'workCenter': this.op.WorkCenter
          },
        });
        this.modal.backdropDismiss = false;
        await this.modal.present();

        //ici on récupère les données prises depuis le popup
        const { data } = await this.modal.onDidDismiss();
        if (data != undefined) {
          this.op.ActivityType = data.result.ActivityType;
          this.op.ActivityTypeDescr = data.result.ActivityTypeDescr;
          if (this.op.ActivityType !== "") {
            this.actType = this.op.ActivityType;
            if (this.op.ActivityTypeDescr !== "") {
              this.actType += " - " + this.op.ActivityTypeDescr;
            }
          }
        }
      }
      else if (this.mode === 'create') {
        let plt = "";
        this.storage.get("choosenPlant").then(
          async (plant) => {
            if (plant != null && plant != undefined && plant !== "") {
              plt = plant;
              //ici on instancie la popup en lui disant quel contenu afficher
              this.modal = await this.modalController.create({
                component: ActTypeListPage,/*ceci est une page qu'on a créé
                    avec la cde ionic g page nomDeLaPage*/
                componentProps: {
                  'plant': plt,
                  'workCenter': this.op.WorkCenter
                },
              });
              this.modal.backdropDismiss = false;
              await this.modal.present();

              //ici on récupère les données prises depuis le popup
              const { data } = await this.modal.onDidDismiss();
              if (data != undefined) {
                console.log("data:", data);
                this.op.ActivityType = data.result.ActivityType;
                this.op.ActivityTypeDescr = data.result.ActivityTypeDescr;
                if (this.op.ActivityType !== "") {
                  this.actType += this.op.ActivityType;
                  if (this.op.ActivityTypeDescr !== "") {
                    this.actType += " - " + this.op.ActivityTypeDescr;
                  }
                }
              }
            }
          })

      }
    }
  }

  async displayChecklistDetails(){
    this.modal = await this.modalController.create({
      component: ChecklistDetailsPage,
      componentProps: {
        'orderNo' : this.op.OrderNo,
        'plant': this.op.Plant
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined){
      console.log(data);
    }
  }

  async selectCheckList() {
    this.modal = await this.modalController.create({
      component: ChecklistPage,
      componentProps: {},
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      console.log(data.result);
      this.op.ChklstId = data.result.ChklstId;

      if (data.result.Title.length > 22) {
        let x = data.result.Title;
        this.op.ChklstTitle = x + "...";
      }
      else {
        this.op.ChklstTitle = data.result.Title;
      }

      if (this.op.ChklstId !== "") {
        this.checkList = this.op.ChklstId;
        if (this.op.ChklstTitle !== "") {
          this.checkList += " - " + this.op.ChklstTitle;
        }
      }
    }

  }

  async selectWorkCenter() {
    this.modal = await this.modalController.create({
      component: WorkCenterListPage,
      componentProps: {},
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.op.WorkCenter = data.result.WorkCenterId;
      this.op.WorkCenterDescr = data.result.WorkCenterDescr;
      this.op.WorkCenterShort = data.result.WorkCenterShort;
      if (this.op.WorkCenterShort !== "") {
        this.workCenter = this.op.WorkCenterShort;
        if (this.op.WorkCenterDescr !== "") {
          this.workCenter += " - " + this.op.WorkCenterDescr;
        }
      }
    }
  }

  async presentRestConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: '<strong>All data will be lost. Do you want to continue </strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.reset();
          }
        }
      ]
    });

    await alert.present();
  }

  reset(){
    this.operationFormGroup.controls.operation.setValue("");
    this.operationFormGroup.controls.description.setValue("");
    this.operationFormGroup.controls.standardText.setValue("");
    this.operationFormGroup.controls.workCenter.setValue("");
    this.operationFormGroup.controls.assignee.setValue("");
    this.operationFormGroup.controls.actType.setValue("");
    this.operationFormGroup.controls.duration.setValue("");
    this.operationFormGroup.controls.numEmployees.setValue("");
    this.operationFormGroup.controls.checklist.setValue("");
  }

}
