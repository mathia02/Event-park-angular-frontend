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
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  CategoryService
} from '../../../../core/services/category.service';

@Component({
  selector: 'app-admin-category-edit',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:
    './category-edit.component.html',

  styleUrls: [
    '../../admin-management.css'
  ]
})
export class AdminCategoryEditComponent
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly categoryService =
    inject(CategoryService);

  categoryId =
    signal(0);

  isLoading =
    signal(true);

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

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot
          .paramMap.get('categoryId')
      );

    if (!id) {

      this.errorMessage.set(
        'Invalid category ID.'
      );

      this.isLoading.set(false);

      return;
    }

    this.categoryId.set(id);

    this.categoryService
      .getCategoryById(id)
      .subscribe({

        next: (category) => {

          this.categoryForm.patchValue({

            name:
              category.name,

            description:
              category.description
              ?? ''

          });

          this.isLoading.set(false);
        },

        error: (error) => {

          this.errorMessage.set(
            error?.error?.message
            ??
            'Unable to load category.'
          );

          this.isLoading.set(false);
        }

      });
  }

  updateCategory(): void {

    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      return;
    }

    const value =
      this.categoryForm.getRawValue();

    this.isSaving.set(true);

    this.errorMessage.set('');

    this.categoryService
      .updateCategory(
        this.categoryId(),
        {

          name:
            value.name.trim(),

          description:
            value.description.trim()
            || null

        }
      )
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
            'Unable to update category.'
          );

          this.isSaving.set(false);
        }

      });
  }
}
