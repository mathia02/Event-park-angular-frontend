import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Customer } from '../models/customer/customer.model';
import { CustomerUpdate } from '../models/customer/customer-update.model';

export interface CustomerMessageResponse {
  message: string;
}

export interface ReactivateCustomerResponse {
  message: string;
  customer: Customer;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(search?: string): Observable<Customer[]> {

    let params = new HttpParams();

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<Customer[]>(
      this.apiUrl,
      { params }
    );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/${id}`
    );
  }

  updateCustomer(
    id: number,
    data: CustomerUpdate
  ): Observable<Customer> {
    return this.http.put<Customer>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deactivateCustomer(
    id: number
  ): Observable<CustomerMessageResponse> {
    return this.http.delete<CustomerMessageResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  reactivateCustomer(
    id: number
  ): Observable<ReactivateCustomerResponse> {
    return this.http.post<ReactivateCustomerResponse>(
      `${this.apiUrl}/${id}/reactivate`,
      {}
    );
  }
}