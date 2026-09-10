import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  CustomerSidebarComponent
} from '../../shared/components/customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CustomerSidebarComponent
  ],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})
export class CustomerLayoutComponent {
}
