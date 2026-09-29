import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface AdminApplication {
  id: number;
  customer: string;
  loanType: string;
  amount: number;
  submittedDate: string;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  currentUser = this.getCurrentUser();

  adminName =
    this.currentUser?.fullName ||
    'Employee';

  adminEmail =
    this.currentUser?.email || '';

  showAccountMenu = false;

  applications = signal<AdminApplication[]>([]);

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

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService
      .getAvailableApplications()
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
            'Failed to load admin applications:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'We could not load the available applications.'
          );
        }
      });
  }


  private mapApplication(
    application: any
  ): AdminApplication {

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


  get pendingApplications(): number {

    return this.applications().filter(
      application =>
        application.status === 'PENDING'
    ).length;
  }


  get dashboardApplications():
    AdminApplication[] {

    /*
      The backend already provides the
      available application queue.

      We only limit the dashboard preview
      to five applications.
    */

    return this.applications().slice(0, 5);
  }


  reviewApplication(
    id: number
  ): void {

    if (!this.adminEmail) {

      this.errorMessage.set(
        'Employee account information is missing.'
      );

      return;
    }

    /*
      Claim the application BEFORE opening
      the review page.

      This prevents another employee from
      successfully claiming the same
      PENDING application.
    */

    this.apiService
      .claimApplication(
        id,
        this.adminEmail
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/admin/applications',
            id
          ]);
        },

        error: (error) => {

          console.error(
            'Failed to claim application:',
            error
          );

          this.errorMessage.set(
            'This application could not be claimed. It may already be under review.'
          );
          
          /*
            Refresh the queue in case another
            employee claimed it first.
          */
          this.loadApplications();
        }
      });
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