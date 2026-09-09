import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Payment } from '../models/payment/payment.model';
import { PaymentCreate } from '../models/payment/payment-create.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.apiUrl}/payments`
    );
  }

  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.apiUrl}/payments/my`
    );
  }

  getPaymentById(
    id: number
  ): Observable<Payment> {
    return this.http.get<Payment>(
      `${this.apiUrl}/payments/${id}`
    );
  }

  createPayment(
    bookingId: number,
    data: PaymentCreate
  ): Observable<Payment> {
    return this.http.post<Payment>(
      `${this.apiUrl}/bookings/${bookingId}/payments`,
      data
    );
  }
}