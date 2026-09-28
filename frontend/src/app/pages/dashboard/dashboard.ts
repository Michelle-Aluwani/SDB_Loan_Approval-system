import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  profileMenuOpen = false;

  email = localStorage.getItem('demoUserEmail') || 'customer@example.com';

  loans = [
    {
      name: 'Personal Loan',
      category: 'Personal',
      amount: 'Flexible loan amount',
      description:
        'Finance personal expenses and planned purchases with flexible repayment options.'
    },
    {
      name: 'Student Loan',
      category: 'Education',
      amount: 'Based on study costs',
      description:
        'Financial support for eligible study costs with an employed guarantor.'
    },
    {
      name: 'Vehicle Finance',
      category: 'Vehicle',
      amount: 'Based on vehicle finance needs',
      description:
        'Finance the purchase of a qualifying new or used vehicle.'
    },
    {
      name: 'Home Loan',
      category: 'Property',
      amount: 'Based on affordability',
      description:
        'Long-term financing designed to help with the purchase of a home.'
    },
    {
      name: 'Revolving Credit',
      category: 'Credit',
      amount: 'R6 000 – R300 000',
      description:
        'Access qualifying credit again after part of the outstanding balance has been repaid.'
    },
    {
      name: 'Debt Consolidation',
      category: 'Debt management',
      amount: 'Based on qualifying debt',
      description:
        'Combine qualifying external fixed-term personal debt into one repayment.'
    }
  ];

  constructor(private router: Router) {}

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    localStorage.removeItem('demoUserEmail');
    this.router.navigate(['/']);
  }

  getLoanRoute(loanName: string): string {
  const routes: Record<string, string> = {
    'Personal Loan': 'personal',
    'Student Loan': 'student',
    'Vehicle Finance': 'vehicle',
    'Home Loan': 'home',
    'Revolving Credit': 'revolving',
    'Debt Consolidation': 'debt'
  };

  return routes[loanName] || '';
}
checkQualification(loanName: string): void {

  const routes: Record<string, string> = {
    'Personal Loan': 'personal',
    'Student Loan': 'student',
    'Vehicle Finance': 'vehicle',
    'Home Loan': 'home',
    'Revolving Credit': 'revolving',
    'Debt Consolidation': 'debt'
  };

  const loanType = routes[loanName];

  if (loanType) {
    this.router.navigate(['/qualify', loanType]);
  }
}
}