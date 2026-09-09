import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Category } from '../models/category/category.model';
import { CategoryCreate } from '../models/category/category-create.model';
import { CategoryUpdate } from '../models/category/category-update.model';

export interface CategoryMessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.apiUrl
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${this.apiUrl}/${id}`
    );
  }

  createCategory(
    data: CategoryCreate
  ): Observable<Category> {
    return this.http.post<Category>(
      this.apiUrl,
      data
    );
  }

  updateCategory(
    id: number,
    data: CategoryUpdate
  ): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteCategory(
    id: number
  ): Observable<CategoryMessageResponse> {
    return this.http.delete<CategoryMessageResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}