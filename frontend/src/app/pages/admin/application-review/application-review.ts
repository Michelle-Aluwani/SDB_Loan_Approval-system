import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-application-review',

  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],

  templateUrl: './application-review.html',
  styleUrl: './application-review.css'
})
export class ApplicationReview implements OnInit {

  currentUser = this.getCurrentUser();

  adminName =
    this.currentUser?.fullName ||
    'Employee';

  adminEmail =
    this.currentUser?.email || '';

  showAccountMenu = false;

  applicationId = 0;

  application = signal<any>(null);

  showRejectBox = false;

  rejectionReason = '';

  isLoading = signal(true);

  isProcessing = signal(false);

  errorMessage = signal('');


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}


  ngOnInit(): void {

    this.applicationId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    if (
      !this.applicationId ||
      Number.isNaN(this.applicationId)
    ) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Invalid application number.'
      );

      return;
    }

    this.loadApplication();
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


  loadApplication(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService
      .getApplication(
        this.applicationId
      )
      .subscribe({

        next: (application) => {

          this.application.set(
            application
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load application:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'We could not load this application.'
          );
        }
      });
  }


  get canMakeDecision(): boolean {

    if (!this.application()) {
      return false;
    }

    return (
      this.application().status ===
      'UNDER_REVIEW'
    );
  }


  get loanType(): string {

    if (!this.application()) {
      return 'Loan';
    }

    if (
      this.application().institution !== undefined ||
      this.application().studyCost !== undefined
    ) {
      return 'Student Loan';
    }

    if (
      this.application().vehiclePrice !== undefined ||
      this.application().vehicleType !== undefined
    ) {
      return 'Vehicle Finance';
    }

    if (
      this.application().propertyPrice !== undefined ||
      this.application().propertyAddress !== undefined
    ) {
      return 'Home Loan';
    }

    if (
      this.application().totalDebt !== undefined ||
      this.application().numberOfDebts !== undefined
    ) {
      return 'Debt Consolidation';
    }

    return 'Personal / Revolving Loan';
  }


  get disposableIncome(): number {

    if (!this.application()) {
      return 0;
    }

    const income =
      Number(
        this.application().monthlyIncome || 0
      );

    const expenses =
      Number(
        this.application().monthlyExpenses || 0
      );

    return income - expenses;
  }


  approveApplication(): void {

    if (
      !this.canMakeDecision ||
      !this.adminEmail ||
      this.isProcessing()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Approve application #${this.applicationId}?`
      );

    if (!confirmed) {
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');

    this.apiService
      .approveApplication(
        this.applicationId,
        this.adminEmail
      )
      .subscribe({

        next: () => {

          this.isProcessing.set(false);

          this.router.navigate([
            '/admin/applications'
          ]);
        },

        error: (error) => {

          console.error(
            'Failed to approve application:',
            error
          );

          this.isProcessing.set(false);

          this.errorMessage.set(
            'The application could not be approved.'
          );
        }
      });
  }


  openRejectBox(): void {

    if (
      !this.canMakeDecision ||
      this.isProcessing()
    ) {
      return;
    }

    this.showRejectBox = true;
    this.rejectionReason = '';
  }


  cancelReject(): void {

    if (this.isProcessing()) {
      return;
    }

    this.showRejectBox = false;
    this.rejectionReason = '';
  }


  rejectApplication(): void {

    if (
      !this.canMakeDecision ||
      !this.adminEmail ||
      this.isProcessing()
    ) {
      return;
    }

    const reason =
      this.rejectionReason.trim();

    if (!reason) {

      this.errorMessage.set(
        'Please provide a reason for rejecting the application.'
      );

      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');

    this.apiService
      .rejectApplication(
        this.applicationId,
        this.adminEmail,
        reason
      )
      .subscribe({

        next: () => {

          this.isProcessing.set(false);

          this.showRejectBox = false;

          this.router.navigate([
            '/admin/applications'
          ]);
        },

        error: (error) => {

          console.error(
            'Failed to reject application:',
            error
          );

          this.isProcessing.set(false);

          this.errorMessage.set(
            'The application could not be rejected.'
          );
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
    amount: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'en-ZA',
      {
        style: 'currency',
        currency: 'ZAR',
        maximumFractionDigits: 0
      }
    ).format(
      Number(amount || 0)
    );
  }


  formatDate(
    date: string | null | undefined
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

    if (!status) {
      return '';
    }

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