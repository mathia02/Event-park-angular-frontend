import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Event as EventModel } from '../models/event/event.model';
import { EventCreate } from '../models/event/event-create.model';
import { EventUpdate } from '../models/event/event-update.model';

export interface EventFilters {
  name?: string;
  date?: string;
  venueId?: number;
  categoryId?: number;
}

export interface EventMessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(
    filters?: EventFilters
  ): Observable<EventModel[]> {

    let params = new HttpParams();

    if (filters?.name?.trim()) {
      params = params.set(
        'name',
        filters.name.trim()
      );
    }

    if (filters?.date) {
      params = params.set(
        'date',
        filters.date
      );
    }

    if (filters?.venueId != null) {
      params = params.set(
        'venueId',
        filters.venueId.toString()
      );
    }

    if (filters?.categoryId != null) {
      params = params.set(
        'categoryId',
        filters.categoryId.toString()
      );
    }

    return this.http.get<EventModel[]>(
      this.apiUrl,
      { params }
    );
  }

  getEventById(
    id: number
  ): Observable<EventModel> {
    return this.http.get<EventModel>(
      `${this.apiUrl}/${id}`
    );
  }

  createEvent(
    data: EventCreate
  ): Observable<EventModel> {
    return this.http.post<EventModel>(
      this.apiUrl,
      data
    );
  }

  updateEvent(
    id: number,
    data: EventUpdate
  ): Observable<EventModel> {
    return this.http.put<EventModel>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteEvent(
    id: number
  ): Observable<EventMessageResponse> {
    return this.http.delete<EventMessageResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}