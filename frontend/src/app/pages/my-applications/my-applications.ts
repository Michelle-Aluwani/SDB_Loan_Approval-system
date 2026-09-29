import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface LoanApplication {
  id: number;
  loanName: string;
  amount: number;
  status: string;
  submittedDate: string;

  approvedDate?: string;
  finishedDate?: string;

  canCancel: boolean;
  canView: boolean;

  rawApplication?: any;
}

@Component({
  selector: 'app-my-applications',
  imports: [RouterLink],
  templateUrl: './my-applications.html',
  styleUrl: './my-applications.css'
})
export class MyApplications implements OnInit {

  profileMenuOpen = false;

  currentUser = this.getCurrentUser();

  email =
    this.currentUser?.email ||
    'customer@example.com';

  fullName =
    this.currentUser?.fullName ||
    'Customer';

  activeApplications =
    signal<LoanApplication[]>([]);

  applicationHistory =
    signal<LoanApplication[]>([]);

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

    if (!this.currentUser?.id) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'You must be logged in to view your applications.'
      );

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService
      .getCustomerApplications(
        this.currentUser.id
      )
      .subscribe({

        next: (applications) => {

          const mappedApplications =
            applications.map(
              application =>
                this.mapApplication(application)
            );

          this.activeApplications.set(
            mappedApplications.filter(
              application =>
                !this.isHistoryStatus(
                  application.status
                )
            )
          );

          this.applicationHistory.set(
            mappedApplications.filter(
              application =>
                this.isHistoryStatus(
                  application.status
                )
            )
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load applications:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'We could not load your applications.'
          );
        }
      });
  }


  private mapApplication(
    application: any
  ): LoanApplication {

    return {

      id: application.id,

      loanName:
        this.getLoanName(application),

      amount:
        Number(application.requestedAmount),

      status:
        application.status,

      submittedDate:
        this.formatDate(
          application.submittedAt
        ),

      approvedDate:
        application.status === 'APPROVED' &&
        application.reviewedAt
          ? this.formatDate(
              application.reviewedAt
            )
          : undefined,

      canCancel:
        this.canCancelStatus(
          application.status
        ),

      canView: true,

      rawApplication: application
    };
  }


  private getLoanName(
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

    if (
      Number(application.requestedAmount) >= 6000 &&
      Number(application.requestedAmount) <= 300000 &&
      application.termMonths !== undefined
    ) {
      return 'Personal / Revolving Loan';
    }

    return 'Personal Loan';
  }


  private canCancelStatus(
    status: string
  ): boolean {

    return (
      status === 'PENDING' ||
      status ===
        'AWAITING_GUARANTOR_SIGNATURE'
    );
  }


  private isHistoryStatus(
    status: string
  ): boolean {

    return (
      status === 'REJECTED' ||
      status === 'CANCELLED' ||
      status === 'FINISHED'
    );
  }


  toggleProfileMenu(): void {
    this.profileMenuOpen =
      !this.profileMenuOpen;
  }


  openApplication(
    application: LoanApplication
  ): void {

    if (!application.canView) {
      return;
    }

    this.router.navigate([
      '/applications',
      application.id
    ]);
  }


  cancelApplication(
    application: LoanApplication,
    event: Event
  ): void {

    event.stopPropagation();

    if (!application.canCancel) {
      return;
    }

    if (!this.currentUser?.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to cancel application #${application.id}?`
      );

    if (!confirmed) {
      return;
    }

    this.apiService
      .cancelApplication(
        application.id,
        this.currentUser.id
      )
      .subscribe({

        next: () => {
          this.loadApplications();
        },

        error: (error) => {

          console.error(
            'Failed to cancel application:',
            error
          );

          this.errorMessage.set(
            'We could not cancel this application.'
          );
        }
      });
  }


  logout(): void {

    localStorage.removeItem(
      'currentUser'
    );

    this.router.navigate(['/']);
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


  formatDate(
    date: string
  ): string {

    if (!date) {
      return 'Not available';
    }

    return new Intl.DateTimeFormat(
      'en-ZA',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );
  }


  getStatusLabel(
    status: string
  ): string {

    return status
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      );
  }
}