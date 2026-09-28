import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-loan-qualification',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './loan-qualification.html',
  styleUrl: './loan-qualification.css'
})
export class LoanQualification {

  loanType = '';
  loanName = '';
  requirements: any = null;
  checked = false;
  mayQualify = false;

  reasons: string[] = [];

  form = {
    age: null as number | null,
    monthlyIncome: null as number | null,
    monthlyExpenses: null as number | null,
    requestedAmount: null as number | null,
    employmentStatus: '',

    // Student
    studyType: '',
    hasGuarantor: '',
    guarantorIncome: null as number | null,
    guarantorExpenses: null as number | null,
    // Vehicle
    hasDriversLicence: '',

    // Home
    propertyPrice: null as number | null,

    // Debt consolidation
    numberOfDebts: null as number | null
  };

  private loanNames: Record<string, string> = {
    personal: 'Personal Loan',
    student: 'Student Loan',
    vehicle: 'Vehicle Finance',
    home: 'Home Loan',
    revolving: 'Revolving Credit',
    debt: 'Debt Consolidation'
  };

loadRequirements(): void {

  this.http
    .get('/data/requirements.json')
    .subscribe({
      next: (data) => {
        this.requirements = data;

        console.log(
          'Loan requirements loaded:',
          this.requirements
        );
      },

      error: (error) => {
        console.error(
          'Could not load loan requirements:',
          error
        );
      }
    });

}
constructor(
  private route: ActivatedRoute,
  private router: Router,
  private http: HttpClient
) {

  this.loanType =
    this.route.snapshot.paramMap.get('type') || '';

  this.loanName =
    this.loanNames[this.loanType] || 'Loan';

  this.loadRequirements();
}

checkQualification(): void {

  this.reasons = [];
  this.checked = true;

  if (!this.requirements) {

    this.mayQualify = false;

    this.reasons.push(
      'Loan requirements could not be loaded.'
    );

    return;
  }


  const loan =
    this.requirements[this.loanType];


  if (!loan) {

    this.mayQualify = false;

    this.reasons.push(
      'Requirements for this loan could not be found.'
    );

    return;
  }


  /*
   * ==========================================
   * STUDENT LOAN
   * ==========================================
   *
   * Student is handled separately because
   * full-time and part-time students use
   * different financial information.
   */

  if (this.loanType === 'student') {

    const rules = loan.rules;


    if (
      this.form.requestedAmount === null ||
      !this.form.studyType
    ) {

      this.reasons.push(
        'Please complete all required information.'
      );

      this.mayQualify = false;

      return;
    }


    /*
     * Minimum student loan amount
     */

    if (
      rules.minimumLoanAmount &&
      this.form.requestedAmount <
      rules.minimumLoanAmount
    ) {

      this.reasons.push(
        `The minimum Student Loan amount is R${rules.minimumLoanAmount.toLocaleString('en-ZA')}.`
      );

    }


    /*
     * FULL-TIME STUDENT
     */

    if (this.form.studyType === 'FULL_TIME') {

      const fullTime =
        rules.fullTime;


      if (
        fullTime.requiresGuarantor &&
        this.form.hasGuarantor !== 'YES'
      ) {

        this.reasons.push(
          'A full-time employed guarantor/surety is required.'
        );

      }


      if (
        this.form.hasGuarantor === 'YES'
      ) {

        if (
          this.form.guarantorIncome === null
        ) {

          this.reasons.push(
            'Please provide the guarantor/surety monthly income.'
          );

        }

        else if (
          this.form.guarantorIncome <
          fullTime.guarantorMinimumMonthlyIncome
        ) {

          this.reasons.push(
            `The guarantor/surety must earn at least R${fullTime.guarantorMinimumMonthlyIncome.toLocaleString('en-ZA')} per month.`
          );

        }


        if (
          this.form.guarantorExpenses === null
        ) {

          this.reasons.push(
            'Please provide the guarantor/surety monthly expenses.'
          );

        }

        else if (
          this.form.guarantorIncome !== null &&
          this.form.guarantorExpenses >=
          this.form.guarantorIncome
        ) {

          this.reasons.push(
            'The guarantor/surety declared expenses leave insufficient available income for this basic affordability check.'
          );

        }

      }

    }


    /*
     * PART-TIME STUDENT
     */

    else if (
      this.form.studyType === 'PART_TIME'
    ) {

      const partTime =
        rules.partTime;


      if (
        this.form.monthlyIncome === null ||
        this.form.monthlyExpenses === null
      ) {

        this.reasons.push(
          'Please provide your monthly income and expenses.'
        );

      }

      else {

        if (
          this.form.monthlyIncome <
          partTime.minimumMonthlyIncome
        ) {

          this.reasons.push(
            `The minimum monthly income for this part-time Student Loan pre-check is R${partTime.minimumMonthlyIncome.toLocaleString('en-ZA')}.`
          );

        }


        if (
          this.form.monthlyExpenses >=
          this.form.monthlyIncome
        ) {

          this.reasons.push(
            'Your declared monthly expenses leave insufficient available income for this basic affordability check.'
          );

        }

      }

    }


    this.mayQualify =
      this.reasons.length === 0;

    return;
  }



  /*
   * ==========================================
   * OTHER LOANS
   * ==========================================
   */

  const qualification =
    loan.qualification;


  if (
    this.form.age === null ||
    this.form.monthlyIncome === null ||
    this.form.monthlyExpenses === null ||
    this.form.requestedAmount === null
  ) {

    this.reasons.push(
      'Please complete all required information.'
    );

    this.mayQualify = false;

    return;
  }



  /*
   * AGE
   */

  if (
    qualification.minimumAge &&
    this.form.age <
    qualification.minimumAge
  ) {

    this.reasons.push(
      `You must be at least ${qualification.minimumAge} years old.`
    );

  }


  if (
    qualification.maximumAge &&
    this.form.age >
    qualification.maximumAge
  ) {

    this.reasons.push(
      `The maximum age used for this pre-check is ${qualification.maximumAge}.`
    );

  }



  /*
   * MINIMUM INCOME
   */

  if (
    qualification.minimumMonthlyIncome &&
    this.form.monthlyIncome <
    qualification.minimumMonthlyIncome
  ) {

    this.reasons.push(
      `The minimum monthly income used for this pre-check is R${qualification.minimumMonthlyIncome.toLocaleString('en-ZA')}.`
    );

  }



  /*
   * BASIC AFFORDABILITY
   */

  if (
    qualification.requiresAffordabilityCheck &&
    this.form.monthlyExpenses >=
    this.form.monthlyIncome
  ) {

    this.reasons.push(
      'Your declared monthly expenses leave insufficient available income for this basic affordability check.'
    );

  }



  /*
   * PERSONAL / REVOLVING AMOUNT LIMITS
   */

  if (loan.loan) {

    if (
      loan.loan.minimumAmount &&
      this.form.requestedAmount <
      loan.loan.minimumAmount
    ) {

      this.reasons.push(
        `The minimum loan amount is R${loan.loan.minimumAmount.toLocaleString('en-ZA')}.`
      );

    }


    if (
      loan.loan.maximumAmount &&
      this.form.requestedAmount >
      loan.loan.maximumAmount
    ) {

      this.reasons.push(
        `The maximum loan amount is R${loan.loan.maximumAmount.toLocaleString('en-ZA')}.`
      );

    }

  }



  /*
   * VEHICLE FINANCE
   */

  if (
    this.loanType === 'vehicle' &&
    qualification.requiresSouthAfricanDriversLicence &&
    this.form.hasDriversLicence !== 'YES'
  ) {

    this.reasons.push(
      'A valid South African driver licence is required.'
    );

  }



  /*
   * DEBT CONSOLIDATION
   */

  if (this.loanType === 'debt') {

    const debtRules =
      loan.debts;


    if (
      this.form.numberOfDebts === null
    ) {

      this.reasons.push(
        'Please enter the number of debts you would like to consolidate.'
      );

    }

    else {

      if (
        this.form.numberOfDebts <
        debtRules.minimumNumberOfDebts
      ) {

        this.reasons.push(
          `At least ${debtRules.minimumNumberOfDebts} qualifying debt is required.`
        );

      }


      if (
        this.form.numberOfDebts >
        debtRules.maximumNumberOfDebts
      ) {

        this.reasons.push(
          `A maximum of ${debtRules.maximumNumberOfDebts} qualifying debts can be consolidated.`
        );

      }

    }

  }


  this.mayQualify =
    this.reasons.length === 0;

}

  applyNow(): void {

    this.router.navigate(
      ['/apply'],
      {
        queryParams: {
          loan: this.loanType
        }
      }
    );

  }


  tryAgain(): void {

    this.checked = false;
    this.reasons = [];

  }

}