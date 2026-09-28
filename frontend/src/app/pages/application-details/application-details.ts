import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface ApplicationDetailsData {
  id: string;
  loanName: string;
  amount: number;
  status: string;

  submittedDate: string;
  approvedDate: string;
  finishedDate?: string;

  contractFile: string;
}

@Component({
  selector: 'app-application-details',
  imports: [RouterLink],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css'
})
export class ApplicationDetails {

  applicationId = '';

  application?: ApplicationDetailsData;


  private applications: ApplicationDetailsData[] = [

    {
      id: 'APP-1029',
      loanName: 'Home Loan',
      amount: 850000,
      status: 'APPROVED',
      submittedDate: '04 August 2026',
      approvedDate: '18 August 2026',
      contractFile: 'mock-loan-contract.pdf'
    },

    {
      id: 'APP-0821',
      loanName: 'Vehicle Finance',
      amount: 180000,
      status: 'FINISHED',
      submittedDate: '02 February 2023',
      approvedDate: '14 February 2023',
      finishedDate: '03 May 2026',
      contractFile: 'mock-loan-contract.pdf'
    },

    {
      id: 'APP-0715',
      loanName: 'Personal Loan',
      amount: 25000,
      status: 'FINISHED',
      submittedDate: '10 March 2021',
      approvedDate: '17 March 2021',
      finishedDate: '20 March 2024',
      contractFile: 'mock-loan-contract.pdf'
    }

  ];


  constructor(
    private route: ActivatedRoute
  ) {

    this.applicationId =
      this.route.snapshot.paramMap.get('id') || '';

    this.application =
      this.applications.find(
        application =>
          application.id === this.applicationId
      );

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

}