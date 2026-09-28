import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface LoanApplication {
  id: string;
  loanName: string;
  amount: number;
  status: string;

  submittedDate: string;

  approvedDate?: string;
  finishedDate?: string;

  canCancel: boolean;
  canView: boolean;
}

@Component({
  selector: 'app-my-applications',
  imports: [RouterLink],
  templateUrl: './my-applications.html',
  styleUrl: './my-applications.css'
})
export class MyApplications {

  profileMenuOpen = false;

  email =
    localStorage.getItem('demoUserEmail') ||
    'customer@example.com';


  activeApplications: LoanApplication[] = [

    {
      id: 'APP-1042',
      loanName: 'Personal Loan',
      amount: 45000,
      status: 'UNDER_REVIEW',
      submittedDate: '26 September 2026',
      canCancel: true,
      canView: false
    },

    {
      id: 'APP-1038',
      loanName: 'Student Loan',
      amount: 72000,
      status: 'AWAITING_GUARANTOR_SIGNATURE',
      submittedDate: '23 September 2026',
      canCancel: true,
      canView: false
    },

    {
      id: 'APP-1029',
      loanName: 'Home Loan',
      amount: 850000,
      status: 'APPROVED',
      submittedDate: '04 August 2026',
      approvedDate: '18 August 2026',
      canCancel: false,
      canView: true
    }

  ];


  applicationHistory: LoanApplication[] = [

    {
      id: 'APP-0821',
      loanName: 'Vehicle Finance',
      amount: 180000,
      status: 'FINISHED',
      submittedDate: '02 February 2023',
      approvedDate: '14 February 2023',
      finishedDate: '03 May 2026',
      canCancel: false,
      canView: true
    },

    {
      id: 'APP-0715',
      loanName: 'Personal Loan',
      amount: 25000,
      status: 'FINISHED',
      submittedDate: '10 March 2021',
      approvedDate: '17 March 2021',
      finishedDate: '20 March 2024',
      canCancel: false,
      canView: true
    }

  ];


  constructor(private router: Router) {}


  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }


  openApplication(application: LoanApplication): void {

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

    // Stops the application card click event.
    event.stopPropagation();

    if (!application.canCancel) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel ${application.id}?`
    );

    if (!confirmed) {
      return;
    }

    application.status = 'CANCELLED';
    application.canCancel = false;

    /*
      TEMPORARY FRONTEND BEHAVIOUR

      Later this will call Spring Boot and the database
      will permanently update the application status.
    */

  }


  logout(): void {

    localStorage.removeItem('demoUserEmail');

    this.router.navigate(['/']);

  }


  formatAmount(amount: number): string {

    return new Intl.NumberFormat(
      'en-ZA',
      {
        style: 'currency',
        currency: 'ZAR',
        maximumFractionDigits: 0
      }
    ).format(amount);

  }


  getStatusLabel(status: string): string {

    return status
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, letter => letter.toUpperCase());

  }

}