import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  adminName = 'Employee';

  showAccountMenu = false;


  /*
   * ==========================================
   * MOCK APPLICATION DATA
   * ==========================================
   *
   * This will later come from Spring Boot.
   *
   * Only applications that are successfully
   * submitted and ready for review should
   * appear here.
   *
   * Applications with the status
   * AWAITING_GUARANTOR_SIGNATURE should NOT
   * appear in this queue.
   */

  applications = [
    {
      id: 1001,
      customer: 'John Smith',
      loanType: 'Personal Loan',
      amount: 50000,
      submittedDate: '28 Sep 2026',
      status: 'PENDING'
    },

    {
      id: 1002,
      customer: 'Jane Doe',
      loanType: 'Student Loan',
      amount: 25000,
      submittedDate: '28 Sep 2026',
      status: 'PENDING'
    },

    {
      id: 1003,
      customer: 'Michael Brown',
      loanType: 'Vehicle Finance',
      amount: 180000,
      submittedDate: '27 Sep 2026',
      status: 'PENDING'
    },

    {
      id: 1004,
      customer: 'Sarah Williams',
      loanType: 'Home Loan',
      amount: 850000,
      submittedDate: '27 Sep 2026',
      status: 'PENDING'
    },

    {
      id: 1005,
      customer: 'Thabo Mokoena',
      loanType: 'Debt Consolidation',
      amount: 72000,
      submittedDate: '26 Sep 2026',
      status: 'PENDING'
    }
  ];


  constructor(
    private router: Router
  ) {}


  /*
   * Number of applications currently
   * waiting to be reviewed.
   */

  get pendingApplications(): number {

    return this.applications.filter(
      application =>
        application.status === 'PENDING'
    ).length;

  }


  /*
   * Applications shown on the dashboard.
   *
   * For now this randomises the mock data.
   *
   * Later Spring Boot will decide which
   * applications are available to each
   * employee.
   */

  get dashboardApplications() {

    return [...this.applications]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

  }


  /*
   * Open application review page.
   *
   * Later the backend will claim the
   * application before allowing the
   * employee to work on it.
   */

  reviewApplication(
    id: number
  ): void {

    this.router.navigate([
      '/admin/applications',
      id
    ]);

  }


  /*
   * Employee account dropdown
   */

  toggleAccountMenu(): void {

    this.showAccountMenu =
      !this.showAccountMenu;

  }


  /*
   * Logout
   */

  logout(): void {

    localStorage.removeItem(
      'demoUserEmail'
    );

    this.router.navigate([
      '/login'
    ]);

  }

}