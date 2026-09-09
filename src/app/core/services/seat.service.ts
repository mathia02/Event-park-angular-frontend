import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Seat } from '../models/seat/seat.model';
import { SeatCreate } from '../models/seat/seat-create.model';
import { SeatUpdate } from '../models/seat/seat-update.model';

export interface SeatGenerateResponse {
  message: string;
  totalSeats: number;
  seats: Seat[];
}

export interface SeatMessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEventSeats(
    eventId: number,
    availableOnly: boolean = false
  ): Observable<Seat[]> {

    const params = new HttpParams()
      .set(
        'availableOnly',
        availableOnly.toString()
      );

    return this.http.get<Seat[]>(
      `${this.apiUrl}/events/${eventId}/seats`,
      { params }
    );
  }

  getSeatById(
    id: number
  ): Observable<Seat> {
    return this.http.get<Seat>(
      `${this.apiUrl}/seats/${id}`
    );
  }

  createSeat(
    eventId: number,
    data: SeatCreate
  ): Observable<Seat> {
    return this.http.post<Seat>(
      `${this.apiUrl}/events/${eventId}/seats`,
      data
    );
  }

  generateSeatMap(
    eventId: number,
    rows: number,
    seatsPerRow: number,
    seatType?: string,
    priceOverride?: number
  ): Observable<SeatGenerateResponse> {

    let params = new HttpParams()
      .set('rows', rows.toString())
      .set(
        'seatsPerRow',
        seatsPerRow.toString()
      );

    if (seatType?.trim()) {
      params = params.set(
        'seatType',
        seatType.trim()
      );
    }

    if (priceOverride != null) {
      params = params.set(
        'priceOverride',
        priceOverride.toString()
      );
    }

    return this.http.post<SeatGenerateResponse>(
      `${this.apiUrl}/events/${eventId}/seats/generate`,
      {},
      { params }
    );
  }

  updateSeat(
    id: number,
    data: SeatUpdate
  ): Observable<Seat> {
    return this.http.put<Seat>(
      `${this.apiUrl}/seats/${id}`,
      data
    );
  }

  deleteSeat(
    id: number
  ): Observable<SeatMessageResponse> {
    return this.http.delete<SeatMessageResponse>(
      `${this.apiUrl}/seats/${id}`
    );
  }
}