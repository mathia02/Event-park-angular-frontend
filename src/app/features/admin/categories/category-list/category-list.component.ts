import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  CategoryService
} from '../../../../core/services/category.service';

import {
  Category
} from '../../../../core/models/category/category.model';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './category-list.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminCategoryListComponent
  implements OnInit {

  private readonly categoryService =
    inject(CategoryService);

  categories =
    signal<Category[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');

  deletingId =
    signal<number | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.categoryService
      .getCategories()
      .subscribe({

        next: (response) => {

          this.categories.set(
            response ?? []
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load categories.'
          );

          this.isLoading.set(false);
        }

      });
  }

  deleteCategory(
    category: Category
  ): void {

    const confirmed =
      window.confirm(
        `Delete category "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(
      category.id
    );

    this.errorMessage.set('');

    this.categoryService
      .deleteCategory(
        category.id
      )
      .subscribe({

        next: () => {

          this.categories.update(
            current =>
              current.filter(
                item =>
                  item.id !== category.id
              )
          );

          this.deletingId.set(null);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to delete category.'
          );

          this.deletingId.set(null);
        }

      });
  }
}
