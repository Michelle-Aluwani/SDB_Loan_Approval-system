import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  profileMenuOpen = false;

  currentUser = this.getCurrentUser();

  email = this.currentUser?.email || 'customer@example.com';
  fullName = this.currentUser?.fullName || 'Customer';
  customerId = this.currentUser?.id;

  // Real dashboard statistics
  activeApplications = signal(0);
  approvedLoans = signal(0);

  isLoadingStats = signal(true);
  statsError = signal('');


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


  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}


  ngOnInit(): void {
    this.loadDashboardStats();
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


  loadDashboardStats(): void {

    if (!this.customerId) {

      this.isLoadingStats.set(false);

      this.statsError.set(
        'Unable to identify the logged-in customer.'
      );

      return;
    }


    this.isLoadingStats.set(true);
    this.statsError.set('');


    this.apiService
      .getCustomerApplications(this.customerId)
      .subscribe({

        next: (applications: any[]) => {

          const active =
            applications.filter(application =>
              application.status === 'PENDING' ||
              application.status === 'UNDER_REVIEW' ||
              application.status ===
                'AWAITING_GUARANTOR_SIGNATURE'
            );


          const approved =
            applications.filter(application =>
              application.status === 'APPROVED'
            );


          this.activeApplications.set(
            active.length
          );

          this.approvedLoans.set(
            approved.length
          );

          this.isLoadingStats.set(false);
        },


        error: (error) => {

          console.error(
            'Failed to load dashboard statistics:',
            error
          );

          this.statsError.set(
            'Unable to load your application statistics.'
          );

          this.isLoadingStats.set(false);
        }

      });
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


  checkQualification(
    loanName: string
  ): void {

    const loanType =
      this.getLoanRoute(loanName);


    if (loanType) {

      this.router.navigate([
        '/qualify',
        loanType
      ]);

    }
  }
}