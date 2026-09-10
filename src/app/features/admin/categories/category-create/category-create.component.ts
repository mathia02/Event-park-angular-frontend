import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  CategoryService
} from '../../../../core/services/category.service';

@Component({
  selector: 'app-admin-category-create',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './category-create.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminCategoryCreateComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly router =
    inject(Router);

  private readonly categoryService =
    inject(CategoryService);

  isSaving =
    signal(false);

  errorMessage =
    signal('');

  categoryForm =
    this.fb.nonNullable.group({

      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(500)
        ]
      ]

    });

  createCategory(): void {

    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      return;
    }

    this.isSaving.set(true);

    this.errorMessage.set('');

    const value =
      this.categoryForm.getRawValue();

    this.categoryService
      .createCategory({

        name:
          value.name.trim(),

        description:
          value.description.trim()
          || null

      })
      .subscribe({

        next: () => {

          this.isSaving.set(false);

          this.router.navigate([
            '/admin/categories'
          ]);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to create category.'
          );

          this.isSaving.set(false);
        }

      });
  }
}
