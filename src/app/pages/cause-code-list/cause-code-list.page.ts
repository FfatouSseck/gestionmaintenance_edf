import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CausegroupService } from 'src/app/providers/causegroup.service';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/internal/operators';
import { CauseCode } from 'src/app/interfaces/causecode.interface';


@Component({
  selector: 'app-cause-code-list',
  templateUrl: './cause-code-list.page.html',
  styleUrls: ['./cause-code-list.page.scss'],
})
export class CauseCodeListPage implements OnInit {

  searchTerm: string = '';
  searchControl: FormControl;
  causeCodes: CauseCode[]=[];

  constructor() { }

  ngOnInit() {
  }

}
