import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { StandardTextService } from 'src/app/providers/standard-text.service';
import { MockService } from 'src/app/providers/mock.service';
import { StandardTextListPage } from '../standard-text-list/standard-text-list.page';
import { WorkCenterService } from 'src/app/providers/work-center.service';
import { WorkCenterListPage } from '../work-center-list/work-center-list.page';

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

  constructor(public modalController: ModalController, public _formBuilder: FormBuilder,
    private storage: Storage, private mockService: MockService, public workcenterService: WorkCenterService,
    private standardTextService: StandardTextService) { }

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
    this.standardText = this.op.StandardTextKey;
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
    let standardTexts: any;
    if (this.mock) {
      standardTexts = this.mockService.getMockStandardTextsSet();
    }
    else {
      this.standardTextService.getAllStandardTexts().subscribe(
        (texts) => {
          standardTexts = texts.d.results;
          console.log("standardTexts", standardTexts);
        });
    }

    this.modal = await this.modalController.create({
      component: StandardTextListPage,
      componentProps: {
        'standardTexts': standardTexts
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.op.StandardTextKey = data.result.StandardTextKey;
      this.op.StandardTextDescr = data.result.ShortText;
      this.standardText = this.op.StandardTextKey + " - " + this.op.StandardTextDescr;
    }
  }

  selectAssignee() {

  }

  selectActType() {

  }

  selectCheckList() {

  }

  async selectWorkCenter() {
    let workCenters: any[] = [];
    if (this.mock) {
      if (this.op.Plant !== '') {
        workCenters = this.mockService.getMockWorkCentersByPlant(this.op.Plant);
        console.log("iciii",workCenters);
      }
    }
    else {
      if (this.op.Plant !== '') {
        this.workcenterService.getWorkCentersByPlant(this.op.Plant).subscribe(
          (wc) =>{
            workCenters = wc.d.results;
            console.log("iciii",workCenters);
          }
        )
      }
    }

    this.modal = await this.modalController.create({
      component: WorkCenterListPage,
      componentProps: {
        'workCenters': workCenters
      },
    });
    this.modal.backdropDismiss = false;
    await this.modal.present();

    const { data } = await this.modal.onDidDismiss();
    if (data != undefined) {
      this.op.WorkCenter = data.result.WorkCenterId;
      this.op.WorkCenterDescr = data.result.WorkCenterDescr;
      this.op.WorkCenterShort = data.result.WorkCenterShort;
      this.workCenter = this.op.WorkCenterShort + " - " + this.op.WorkCenterDescr;
    }
  }

}
