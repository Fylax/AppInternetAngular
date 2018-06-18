import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {AdminService} from '../../../../services/admin.service';
import {tap} from 'rxjs/operators';
import {UserDataSource} from './UserDataSource';
import {Subscription} from 'rxjs';
import {CustomerDataSource} from './CustomerDataSource';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  displayedColumns = ['user', 'details'];
  userDataSource: UserDataSource;
  customerDataSource: CustomerDataSource;

  private subscriptionUser: Subscription;
  userTotals = 0;

  private subscriptionCustomer: Subscription;
  customerTotals = 0;

  @ViewChild('paginatorUsers') paginatorUsers: MatPaginator;
  @ViewChild('paginatorCustomers') paginatorCustomers: MatPaginator;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.userDataSource = new UserDataSource(this.adminService);
    this.subscriptionUser = this.userDataSource.resultLength
        .subscribe(totals => this.userTotals = totals);
    this.userDataSource.loadUsers(1, 10);
    this.customerDataSource = new CustomerDataSource(this.adminService);
    this.subscriptionCustomer = this.customerDataSource.resultLength
        .subscribe(totals => this.customerTotals = totals);
    this.customerDataSource.loadCustomer(1, 10);
  }
  ngAfterViewInit(): void {
    this.paginatorUsers.page
        .pipe(
            tap(() => this.loadUsersPage())
        )
        .subscribe();
    this.paginatorCustomers.page
        .pipe(
            tap(() => this.loadCustomersPage())
        )
        .subscribe();
  }

  loadCustomersPage() {
    this.customerDataSource.loadCustomer(
        this.paginatorCustomers.pageIndex + 1,
        this.paginatorCustomers.pageSize);
  }

  loadUsersPage() {
    this.userDataSource.loadUsers(
        this.paginatorUsers.pageIndex + 1,
        this.paginatorUsers.pageSize);
  }

}
