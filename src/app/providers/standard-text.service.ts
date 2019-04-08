import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StandardTextService extends BaseService {

  constructor(public http: HttpClient) { 
    super(http)
  }

  getAllStandardTexts(){
    return this.getAll('StandardTextSet');
  }
}
