import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

@Component({
  selector: 'app-application-review',

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './application-review.html',
  styleUrl: './application-review.css'
})
export class ApplicationReview {

  adminName = 'Employee';

  showAccountMenu = false;

  applicationId = 0;

  selectedDocument: any = null;

  showRejectBox = false;

  rejectionReason = '';


  /*
   * ==========================================
   * MOCK APPLICATION
   * ==========================================
   *
   * Later:
   *
   * GET /api/admin/applications/{id}
   *
   * The backend must verify that:
   *
   * 1. the employee is authenticated
   * 2. the application belongs to them OR
   *    is available for them to review
   */

  application = {

    id: 1001,

    status: 'PENDING',

    submittedDate: '28 Sep 2026',

    customer: {
      fullName: 'John Smith',
      idNumber: '0001015009087',
      email: 'john.smith@example.com',
      phoneNumber: '071 234 5678',
      residentialAddress:
        '12 Example Street, Johannesburg'
    },

    loan: {
      type: 'Personal Loan',
      requestedAmount: 50000,
      termMonths: 36
    },

    financial: {
      employmentStatus: 'Employed',
      employerName: 'Example Technologies',
      monthlyIncome: 28000,
      monthlyExpenses: 11500,
      disposableIncome: 16500
    },

    qualification: {
      preCheckCompleted: true,
      result: 'MAY_QUALIFY',
      requirementsVersion: '2026-09'
    },

    documents: [
      {
        id: 1,
        name: 'South African ID',
        type: 'PDF',
        previewUrl: '/mock-loan-contract.pdf'
      },
      {
        id: 2,
        name: 'Latest Payslip',
        type: 'PDF',
        previewUrl: '/mock-loan-contract.pdf'
      },
      {
        id: 3,
        name: 'Bank Statements',
        type: 'PDF',
        previewUrl: '/mock-loan-contract.pdf'
      }
    ],

    reviewedBy: null as string | null,

    reviewedDate: null as string | null

  };


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.applicationId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.application.id =
      this.applicationId;

  }


  /*
   * Only PENDING / UNDER_REVIEW applications
   * should allow a decision.
   */

  get canMakeDecision(): boolean {

    return (
      this.application.status === 'PENDING' ||
      this.application.status === 'UNDER_REVIEW'
    );

  }


  /*
   * Preview document inside the application.
   */

  viewDocument(document: any): void {

    this.selectedDocument =
      document;

  }


  closeDocument(): void {

    this.selectedDocument =
      null;

  }


  /*
   * APPROVE
   */

  approveApplication(): void {

    if (!this.canMakeDecision) {
      return;
    }

    this.application.status =
      'APPROVED';

    this.application.reviewedBy =
      this.adminName;

    this.application.reviewedDate =
      new Date().toLocaleDateString('en-ZA');

    /*
     * Later:
     *
     * PUT /api/admin/applications/{id}/approve
     *
     * Backend saves:
     *
     * status
     * reviewedBy
     * reviewedAt
     */

    this.router.navigate([
      '/admin'
    ]);

  }


  /*
   * Open reject reason box.
   */

  openRejectBox(): void {

    if (!this.canMakeDecision) {
      return;
    }

    this.showRejectBox = true;

  }


  cancelReject(): void {

    this.showRejectBox = false;
    this.rejectionReason = '';

  }


  /*
   * REJECT
   */

  rejectApplication(): void {

    if (!this.canMakeDecision) {
      return;
    }

    if (
      this.rejectionReason.trim().length === 0
    ) {
      return;
    }

    this.application.status =
      'REJECTED';

    this.application.reviewedBy =
      this.adminName;

    this.application.reviewedDate =
      new Date().toLocaleDateString('en-ZA');

    /*
     * Later:
     *
     * PUT /api/admin/applications/{id}/reject
     *
     * {
     *   reason: this.rejectionReason
     * }
     */

    this.router.navigate([
      '/admin'
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