import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LoginRequest } from '../models/auth/login-request.model';
import { LoginResponse } from '../models/auth/login-response.model';
import { RegisterRequest } from '../models/auth/register-request.model';
import { ForgotPassword } from '../models/auth/forgot-password.model';
import { ResetPassword } from '../models/auth/reset-password.model';
import { ResendVerification } from '../models/auth/resend-verification.model';
import { Customer } from '../models/customer/customer.model';

export interface MessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly customersUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.authUrl}/login`,
      data
    );
  }

  register(data: RegisterRequest): Observable<Customer> {
    return this.http.post<Customer>(
      `${this.customersUrl}/register`,
      data
    );
  }

  verifyEmail(token: string): Observable<MessageResponse> {
    const params = new HttpParams()
      .set('token', token);

    return this.http.get<MessageResponse>(
      `${this.authUrl}/verify-email`,
      { params }
    );
  }

  resendVerification(
    data: ResendVerification
  ): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.authUrl}/resend-verification`,
      data
    );
  }

  forgotPassword(
    data: ForgotPassword
  ): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.authUrl}/forgot-password`,
      data
    );
  }

  resetPassword(
    data: ResetPassword
  ): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.authUrl}/reset-password`,
      data
    );
  }
}