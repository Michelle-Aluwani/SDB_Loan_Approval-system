import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { catchError, forkJoin, of } from 'rxjs';

interface LoanProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  amountInfo: string;
}

@Component({
  selector: 'app-apply-loan',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './apply-loan.html',
  styleUrl: './apply-loan.css'
})
export class ApplyLoan {

  currentStep = 1;
  profileMenuOpen = false;
  submitted = signal(false);
  isSubmitting = signal(false);
  submissionError = signal('');
  uploadWarning = signal('');

  currentUser = this.getCurrentUser();

  email =
    this.currentUser?.email ||
    'customer@example.com';

  fullName =
    this.currentUser?.fullName ||
    'Customer';

  loanProducts: LoanProduct[] = [
    {
      id: 'personal',
      name: 'Personal Loan',
      category: 'Personal',
      description:
        'Flexible financing for personal expenses and planned purchases.',
      amountInfo:
        'Amount subject to affordability assessment'
    },
    {
      id: 'student',
      name: 'Student Loan',
      category: 'Education',
      description:
        'Financial support towards qualifying study costs.',
      amountInfo:
        'Based on qualifying study costs'
    },
    {
      id: 'vehicle',
      name: 'Vehicle Finance',
      category: 'Vehicle',
      description:
        'Finance the purchase of a qualifying new or used vehicle.',
      amountInfo:
        'Based on vehicle and affordability'
    },
    {
      id: 'home',
      name: 'Home Loan',
      category: 'Property',
      description:
        'Long-term financing towards the purchase of a home.',
      amountInfo:
        'Based on property value and affordability'
    },
    {
      id: 'revolving',
      name: 'Revolving Credit',
      category: 'Credit',
      description:
        'Access qualifying credit again as part of the balance is repaid.',
      amountInfo:
        'R6 000 – R300 000'
    },
    {
      id: 'debt',
      name: 'Debt Consolidation',
      category: 'Debt management',
      description:
        'Combine qualifying existing personal debts into one repayment.',
      amountInfo:
        'Based on qualifying debt'
    }
  ];

  selectedLoan?: LoanProduct;

  personalDetails = {
    fullName: this.currentUser?.fullName || '',
    idNumber: this.currentUser?.idNumber || '',
    phoneNumber: this.currentUser?.phoneNumber || '',
    email: this.email,
    residentialAddress:
      this.currentUser?.residentialAddress || ''
  };

  financialDetails = {
    monthlyIncome: null as number | null,
    monthlyExpenses: null as number | null,
    requestedAmount: null as number | null,
    employmentStatus: '',
    employerName: '',
    termMonths: null as number | null
  };

  studentDetails = {
    studyType: '',
    institution: '',
    course: '',
    studyYear: null as number | null,
    courseDurationMonths: null as number | null,
    studyCost: null as number | null,
    guarantorName: '',
    guarantorIncome: null as number | null,
    guarantorExpenses: null as number | null
  };

  vehicleDetails = {
    vehiclePrice: null as number | null,
    vehicleType: '',
    sellerType: '',
    hasDriversLicence: false
  };

  homeDetails = {
    propertyPrice: null as number | null,
    depositAmount: null as number | null,
    propertyAddress: '',
    jointApplication: false,
    coApplicantIncome: null as number | null
  };

  debtDetails = {
    totalDebt: null as number | null,
    numberOfDebts: null as number | null
  };

  documents = {
    idDocument: null as File | null,
    payslip: null as File | null,
    bankStatements: null as File | null,
    proofOfResidence: null as File | null,
    additionalDocument: null as File | null
  };

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

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

  selectLoan(loan: LoanProduct): void {
    this.selectedLoan = loan;
    this.currentStep = 2;
    window.scrollTo(0, 0);
  }

  nextStep(): void {
    if (this.currentStep < 5) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  onFileSelected(
    event: Event,
    documentType: keyof typeof this.documents
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {
      this.documents[documentType] =
        input.files[0];
    }
  }

  getDocumentName(
    documentType: keyof typeof this.documents
  ): string {

    return this.documents[documentType]?.name ||
      'No file selected';
  }

  submitApplication(): void {

    if (!this.currentUser?.id) {
      this.submissionError.set(
        'You must be logged in before submitting an application.'
      );
      return;
    }

    if (!this.selectedLoan) {
      this.submissionError.set(
        'Please select a loan product.'
      );
      return;
    }

    if (
      this.financialDetails.requestedAmount === null ||
      this.financialDetails.requestedAmount <= 0
    ) {
      this.submissionError.set(
        'Please enter a valid requested loan amount.'
      );
      return;
    }

    const payload =
      this.buildLoanPayload();

    if (!payload) {
      this.submissionError.set(
        'Unable to prepare this application.'
      );
      return;
    }

    this.isSubmitting.set(true);
    this.submissionError.set('');

    this.apiService
      .submitLoan(
        this.selectedLoan.id,
        payload
      )
      .subscribe({

        next: (application) => {

          console.log(
            'Application submitted:',
            application
          );

          this.uploadDocuments(application.id);
        },

        error: (error) => {

          console.error(
            'Application submission failed:',
            error
          );

          this.isSubmitting.set(false);

          this.submissionError.set(
            'We could not submit your application. Please check your information and try again.'
          );
        }
      });
  }

  /*
   * Send the chosen supporting documents to the server,
   * attached to the newly created application.
   */
  private uploadDocuments(applicationId: number): void {

    const documentTypes: Record<
      keyof typeof this.documents,
      string
    > = {
      idDocument: 'ID_DOCUMENT',
      payslip: 'PAYSLIP',
      bankStatements: 'BANK_STATEMENTS',
      proofOfResidence: 'PROOF_OF_RESIDENCE',
      additionalDocument: 'ADDITIONAL_DOCUMENT'
    };

    const uploads = (
      Object.keys(documentTypes) as
        Array<keyof typeof this.documents>
    )
      .filter(key => this.documents[key] !== null)
      .map(key =>
        this.apiService
          .uploadDocument(
            applicationId,
            this.currentUser.id,
            documentTypes[key],
            this.documents[key] as File
          )
          .pipe(
            catchError(error => {
              console.error(
                `Upload failed for ${key}:`,
                error
              );
              return of({ failed: true, key });
            })
          )
      );

    const finish = (results: any[]) => {

      const failed =
        results.filter(result => result?.failed);

      if (failed.length > 0) {
        this.uploadWarning.set(
          'Your application was submitted, but ' +
          failed.length +
          ' document(s) could not be uploaded. ' +
          'Please contact support so they can be added.'
        );
      }

      this.isSubmitting.set(false);
      this.submitted.set(true);

      window.scrollTo(0, 0);
    };

    if (uploads.length === 0) {
      finish([]);
      return;
    }

    forkJoin(uploads).subscribe(finish);
  }

  private buildLoanPayload(): any {

    if (!this.selectedLoan) {
      return null;
    }

    const commonPayload = {

      customer: {
        id: this.currentUser.id
      },

      requestedAmount:
        this.financialDetails.requestedAmount
    };

    switch (this.selectedLoan.id) {

      case 'personal':
        return {
          ...commonPayload,

          monthlyIncome:
            this.financialDetails.monthlyIncome,

          monthlyExpenses:
            this.financialDetails.monthlyExpenses,

          employmentStatus:
            this.financialDetails.employmentStatus,

          employerName:
            this.financialDetails.employerName,

          termMonths:
            this.financialDetails.termMonths
        };


      case 'student':
        return {
          ...commonPayload,

          studyType:
            this.studentDetails.studyType,

          institution:
            this.studentDetails.institution,

          course:
            this.studentDetails.course,

          studyYear:
            this.studentDetails.studyYear,

          courseDurationMonths:
            this.studentDetails.courseDurationMonths,

          studyCost:
            this.studentDetails.studyCost,

          monthlyIncome:
            this.financialDetails.monthlyIncome,

          monthlyExpenses:
            this.financialDetails.monthlyExpenses,

          guarantorName:
            this.studentDetails.guarantorName,

          guarantorIncome:
            this.studentDetails.guarantorIncome,

          guarantorExpenses:
            this.studentDetails.guarantorExpenses
        };


      case 'vehicle':
        return {
          ...commonPayload,

          monthlyIncome:
            this.financialDetails.monthlyIncome,

          monthlyExpenses:
            this.financialDetails.monthlyExpenses,

          employmentStatus:
            this.financialDetails.employmentStatus,

          employerName:
            this.financialDetails.employerName,

          vehiclePrice:
            this.vehicleDetails.vehiclePrice,

          vehicleType:
            this.vehicleDetails.vehicleType,

          sellerType:
            this.vehicleDetails.sellerType,

          hasDriversLicence:
            this.vehicleDetails.hasDriversLicence,

          termMonths:
            this.financialDetails.termMonths
        };


      case 'home':
        return {
          ...commonPayload,

          monthlyIncome:
            this.financialDetails.monthlyIncome,

          monthlyExpenses:
            this.financialDetails.monthlyExpenses,

          employmentStatus:
            this.financialDetails.employmentStatus,

          employerName:
            this.financialDetails.employerName,

          propertyPrice:
            this.homeDetails.propertyPrice,

          depositAmount:
            this.homeDetails.depositAmount,

          propertyAddress:
            this.homeDetails.propertyAddress,

          jointApplication:
            this.homeDetails.jointApplication,

          coApplicantIncome:
            this.homeDetails.jointApplication
              ? this.homeDetails.coApplicantIncome
              : null
        };


      case 'revolving':
        return {
          ...commonPayload,

          monthlyIncome:
            this.financialDetails.monthlyIncome,

          monthlyExpenses:
            this.financialDetails.monthlyExpenses,

          employmentStatus:
            this.financialDetails.employmentStatus,

          employerName:
            this.financialDetails.employerName,

          termMonths:
            this.financialDetails.termMonths
        };


      case 'debt':
        return {
          ...commonPayload,

          monthlyIncome:
            this.financialDetails.monthlyIncome,

          monthlyExpenses:
            this.financialDetails.monthlyExpenses,

          employmentStatus:
            this.financialDetails.employmentStatus,

          employerName:
            this.financialDetails.employerName,

          totalDebt:
            this.debtDetails.totalDebt,

          numberOfDebts:
            this.debtDetails.numberOfDebts
        };


      default:
        return null;
    }
  }

  goToApplications(): void {
    this.router.navigate([
      '/applications'
    ]);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen =
      !this.profileMenuOpen;
  }

  logout(): void {
    localStorage.removeItem(
      'currentUser'
    );

    this.router.navigate(['/']);
  }

  formatAmount(
    amount: number | null
  ): string {

    if (amount === null) {
      return 'Not provided';
    }

    return new Intl.NumberFormat(
      'en-ZA',
      {
        style: 'currency',
        currency: 'ZAR',
        maximumFractionDigits: 0
      }
    ).format(amount);
  }
}