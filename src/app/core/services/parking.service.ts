import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ParkingSlot } from '../models/parking/parking-slot.model';
import { ParkingSlotCreate } from '../models/parking/parking-slot-create.model';
import { ParkingSlotUpdate } from '../models/parking/parking-slot-update.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEventParkingSlots(
    eventId: number,
    availableOnly: boolean = false
  ): Observable<ParkingSlot[]> {

    const params = new HttpParams()
      .set(
        'availableOnly',
        availableOnly.toString()
      );

    return this.http.get<ParkingSlot[]>(
      `${this.apiUrl}/events/${eventId}/parking-slots`,
      { params }
    );
  }

  getParkingSlotById(
    id: number
  ): Observable<ParkingSlot> {
    return this.http.get<ParkingSlot>(
      `${this.apiUrl}/parking-slots/${id}`
    );
  }

  createParkingSlot(
    eventId: number,
    data: ParkingSlotCreate
  ): Observable<ParkingSlot> {
    return this.http.post<ParkingSlot>(
      `${this.apiUrl}/events/${eventId}/parking-slots`,
      data
    );
  }

  updateParkingSlot(
    id: number,
    data: ParkingSlotUpdate
  ): Observable<ParkingSlot> {
    return this.http.put<ParkingSlot>(
      `${this.apiUrl}/parking-slots/${id}`,
      data
    );
  }

  deleteParkingSlot(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/parking-slots/${id}`
    );
  }
}