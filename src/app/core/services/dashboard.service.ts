import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AdminDashboard } from '../models/dashboard/admin-dashboard.model';
import { CustomerDashboard } from '../models/dashboard/customer-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl =
    `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(
      `${this.apiUrl}/admin`
    );
  }

  getCustomerDashboard(): Observable<CustomerDashboard> {
    return this.http.get<CustomerDashboard>(
      `${this.apiUrl}/customer`
    );
  }
}