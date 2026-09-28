import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  submitted = false;

  email =
    localStorage.getItem('demoUserEmail') ||
    'customer@example.com';


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


  /* PERSONAL DETAILS */

  personalDetails = {

    fullName: '',

    idNumber: '',

    phoneNumber: '',

    email: this.email,

    residentialAddress: ''

  };


  /* FINANCIAL DETAILS */

  financialDetails = {

    monthlyIncome: null as number | null,

    monthlyExpenses: null as number | null,

    requestedAmount: null as number | null,

    employmentStatus: '',

    employerName: ''

  };


  /* STUDENT LOAN DETAILS */

  studentDetails = {

    institution: '',

    course: '',

    studyYear: '',

    studyCost: null as number | null,

    guarantorName: '',

    guarantorIncome: null as number | null

  };


  /* VEHICLE DETAILS */

  vehicleDetails = {

    vehiclePrice: null as number | null,

    vehicleType: '',

    sellerType: '',

    driversLicence: ''

  };


  /* HOME LOAN DETAILS */

  homeDetails = {

    propertyPrice: null as number | null,

    depositAmount: null as number | null,

    propertyAddress: ''

  };


  /* DEBT CONSOLIDATION */

  debtDetails = {

    totalDebt: null as number | null,

    numberOfDebts: null as number | null

  };


  /* DOCUMENTS */

  documents = {

    idDocument: null as File | null,

    payslip: null as File | null,

    bankStatements: null as File | null,

    proofOfResidence: null as File | null,

    additionalDocument: null as File | null

  };


  constructor(
    private router: Router
  ) {}


  selectLoan(
    loan: LoanProduct
  ): void {

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

    /*
      TEMPORARY FRONTEND SUBMISSION.

      Later this will send the application and
      uploaded documents to Spring Boot.
    */

    this.submitted = true;

    window.scrollTo(0, 0);

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
      'demoUserEmail'
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