import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface ReviewedApplication {
  id: number;
  customer: string;
  loanType: string;
  amount: number;
  submittedDate: string;
  reviewedDate: string;
  status: string;
}

@Component({
  selector: 'app-applications',

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications implements OnInit {

  currentUser = this.getCurrentUser();

  adminName =
    this.currentUser?.fullName ||
    'Employee';

  adminEmail =
    this.currentUser?.email || '';

  showAccountMenu = false;

  selectedFilter = 'ALL';

  applications = signal<ReviewedApplication[]>([]);

  isLoading = signal(true);

  errorMessage = signal('');


  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}


  ngOnInit(): void {
    this.loadApplications();
  }


  private getCurrentUser(): any {

    const savedUser =
      localStorage.getItem('currentUser');

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  }


  loadApplications(): void {

    if (!this.adminEmail) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Employee account information is missing.'
      );

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService
      .getReviewedApplications(
        this.adminEmail
      )
      .subscribe({

        next: (applications) => {

          this.applications.set(
            applications.map(
              application =>
                this.mapApplication(application)
            )
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load reviewed applications:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'We could not load your reviewed applications.'
          );
        }
      });
  }


  private mapApplication(
    application: any
  ): ReviewedApplication {

    return {

      id:
        application.id,

      customer:
        application.customer?.fullName ||
        'Customer',

      loanType:
        this.getLoanType(application),

      amount:
        Number(application.requestedAmount),

      submittedDate:
        this.formatDate(
          application.submittedAt
        ),

      reviewedDate:
        application.reviewedAt
          ? this.formatDate(
              application.reviewedAt
            )
          : 'Not completed',

      status:
        application.status
    };
  }


  private getLoanType(
    application: any
  ): string {

    if (
      application.institution !== undefined ||
      application.studyCost !== undefined
    ) {
      return 'Student Loan';
    }

    if (
      application.vehiclePrice !== undefined ||
      application.vehicleType !== undefined
    ) {
      return 'Vehicle Finance';
    }

    if (
      application.propertyPrice !== undefined ||
      application.propertyAddress !== undefined
    ) {
      return 'Home Loan';
    }

    if (
      application.totalDebt !== undefined ||
      application.numberOfDebts !== undefined
    ) {
      return 'Debt Consolidation';
    }

    return 'Personal / Revolving Loan';
  }


  get filteredApplications():
    ReviewedApplication[] {

    if (this.selectedFilter === 'ALL') {
      return this.applications();
    }

    return this.applications().filter(
      application =>
        application.status ===
        this.selectedFilter
    );
  }


  get approvedCount(): number {

    return this.applications().filter(
      application =>
        application.status === 'APPROVED'
    ).length;
  }


  get rejectedCount(): number {

    return this.applications().filter(
      application =>
        application.status === 'REJECTED'
    ).length;
  }


  setFilter(
    filter: string
  ): void {

    this.selectedFilter = filter;
  }


  viewApplication(
    id: number
  ): void {

    this.router.navigate([
      '/admin/applications',
      id
    ]);
  }


  toggleAccountMenu(): void {

    this.showAccountMenu =
      !this.showAccountMenu;
  }


  logout(): void {

    localStorage.removeItem(
      'currentUser'
    );

    this.router.navigate([
      '/login'
    ]);
  }


  formatAmount(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-ZA',
      {
        style: 'currency',
        currency: 'ZAR',
        maximumFractionDigits: 0
      }
    ).format(amount);
  }


  private formatDate(
    date: string
  ): string {

    if (!date) {
      return 'Not available';
    }

    return new Intl.DateTimeFormat(
      'en-ZA',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );
  }
}