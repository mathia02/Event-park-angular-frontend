import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { BookingCreate } from '../models/booking/booking-create.model';
import { BookingDetails } from '../models/booking/booking-details.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly apiUrl =
    `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<BookingDetails[]> {
    return this.http.get<BookingDetails[]>(
      this.apiUrl
    );
  }

  getMyBookings(): Observable<BookingDetails[]> {
    return this.http.get<BookingDetails[]>(
      `${this.apiUrl}/my`
    );
  }

  getBookingById(
    id: number
  ): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(
      `${this.apiUrl}/${id}`
    );
  }

  createBooking(
    data: BookingCreate
  ): Observable<BookingDetails> {
    return this.http.post<BookingDetails>(
      this.apiUrl,
      data
    );
  }

  cancelBooking(
    id: number
  ): Observable<BookingDetails> {
    return this.http.put<BookingDetails>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );
  }
}