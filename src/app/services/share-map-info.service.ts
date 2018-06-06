import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {CustomerRequest} from '../components/map/customerbuy/CustomerRequest';

@Injectable({
  providedIn: 'root'
})
export class ShareMapInfoService {

  startDate: Date;
  endDate: Date;
  customerRequest: CustomerRequest;
  private dateReadySource = new Subject<boolean>();
  dateReady$ = this.dateReadySource.asObservable();



  constructor() {
    this.startDate = new Date(0);
    this.endDate = new Date();
  }

  setStartDate(date: Date): void {
    this.startDate.setTime(date.getTime());
  }

  setEndDate(date: Date): void {
    this.endDate.setTime(date.getTime());
  }

  setDateReady(flag: boolean): void {
    this.dateReadySource.next(flag);
  }

  setCustomerRequest(cr: CustomerRequest): void {
    this.customerRequest = cr;
  }
}
