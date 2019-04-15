import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService {

  constructor(public http: HttpClient) { 
    super(http);
  }

  getAllEmployees(){
    return this.getAll('/EmployeeSet');
  }
}
