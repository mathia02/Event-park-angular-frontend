import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Venue } from '../models/venue/venue.model';
import { VenueCreate } from '../models/venue/venue-create.model';
import { VenueUpdate } from '../models/venue/venue-update.model';

export interface VenueAvailabilityResponse {
  venueId: number;
  venueName: string;
  startDateTime: string;
  endDateTime: string;
  isAvailable: boolean;
}

export interface VenueMessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  private readonly apiUrl = `${environment.apiUrl}/venues`;

  constructor(private http: HttpClient) {}

  getVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(
      this.apiUrl
    );
  }

  getVenueById(id: number): Observable<Venue> {
    return this.http.get<Venue>(
      `${this.apiUrl}/${id}`
    );
  }

  getAvailableVenues(
    date: string,
    startTime: string,
    endTime: string
  ): Observable<Venue[]> {

    const params = new HttpParams()
      .set('date', date)
      .set('startTime', startTime)
      .set('endTime', endTime);

    return this.http.get<Venue[]>(
      `${this.apiUrl}/available`,
      { params }
    );
  }

  checkVenueAvailability(
    venueId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Observable<VenueAvailabilityResponse> {

    const params = new HttpParams()
      .set('date', date)
      .set('startTime', startTime)
      .set('endTime', endTime)
      .set('venueId', venueId.toString());

    return this.http.get<VenueAvailabilityResponse>(
      `${this.apiUrl}/available`,
      { params }
    );
  }

  createVenue(data: VenueCreate): Observable<Venue> {
    return this.http.post<Venue>(
      this.apiUrl,
      data
    );
  }

  updateVenue(
    id: number,
    data: VenueUpdate
  ): Observable<Venue> {
    return this.http.put<Venue>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteVenue(
    id: number
  ): Observable<VenueMessageResponse> {
    return this.http.delete<VenueMessageResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}