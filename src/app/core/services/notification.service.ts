import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Notification } from '../models/notification/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly apiUrl =
    `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      this.apiUrl
    );
  }

  getMyNotifications(
    unreadOnly: boolean = false
  ): Observable<Notification[]> {

    const params = new HttpParams()
      .set(
        'unreadOnly',
        unreadOnly.toString()
      );

    return this.http.get<Notification[]>(
      `${this.apiUrl}/my`,
      { params }
    );
  }

  getNotificationById(
    id: number
  ): Observable<Notification> {
    return this.http.get<Notification>(
      `${this.apiUrl}/${id}`
    );
  }

  markAsRead(
    id: number
  ): Observable<Notification> {
    return this.http.put<Notification>(
      `${this.apiUrl}/${id}/read`,
      {}
    );
  }
}