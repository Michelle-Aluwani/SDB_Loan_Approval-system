import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-applications',

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications {

  adminName = 'Employee';

  showAccountMenu = false;

  selectedFilter = 'ALL';


  /*
   * ==========================================
   * MOCK DATA
   * ==========================================
   *
   * IMPORTANT:
   *
   * These represent applications handled by
   * THIS employee only.
   *
   * Later the backend should return something
   * like:
   *
   * GET /api/admin/applications/my-reviewed
   *
   * using the authenticated employee instead
   * of trusting an employee ID from Angular.
   */

  applications = [

    {
      id: 982,
      customer: 'Lerato Nkosi',
      loanType: 'Personal Loan',
      amount: 45000,
      submittedDate: '24 Sep 2026',
      reviewedDate: '25 Sep 2026',
      status: 'APPROVED'
    },

    {
      id: 967,
      customer: 'Sipho Dlamini',
      loanType: 'Vehicle Finance',
      amount: 210000,
      submittedDate: '22 Sep 2026',
      reviewedDate: '23 Sep 2026',
      status: 'REJECTED'
    },

    {
      id: 951,
      customer: 'Naledi Mokoena',
      loanType: 'Student Loan',
      amount: 32000,
      submittedDate: '20 Sep 2026',
      reviewedDate: '21 Sep 2026',
      status: 'APPROVED'
    },

    {
      id: 934,
      customer: 'Thabo Molefe',
      loanType: 'Debt Consolidation',
      amount: 68000,
      submittedDate: '18 Sep 2026',
      reviewedDate: '19 Sep 2026',
      status: 'REJECTED'
    },

    {
      id: 910,
      customer: 'Ayesha Khan',
      loanType: 'Home Loan',
      amount: 920000,
      submittedDate: '14 Sep 2026',
      reviewedDate: '16 Sep 2026',
      status: 'APPROVED'
    }

  ];


  constructor(
    private router: Router
  ) {}


  get filteredApplications() {

    if (this.selectedFilter === 'ALL') {
      return this.applications;
    }

    return this.applications.filter(
      application =>
        application.status ===
        this.selectedFilter
    );

  }


  get approvedCount(): number {

    return this.applications.filter(
      application =>
        application.status === 'APPROVED'
    ).length;

  }


  get rejectedCount(): number {

    return this.applications.filter(
      application =>
        application.status === 'REJECTED'
    ).length;

  }


  setFilter(filter: string): void {

    this.selectedFilter = filter;

  }


  viewApplication(id: number): void {

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
      'demoUserEmail'
    );

    this.router.navigate([
      '/login'
    ]);

  }

}