import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface ApplicationDetailsData {
  id: number;
  loanName: string;
  amount: number;
  status: string;

  submittedDate: string;
  reviewedDate?: string;
  rejectionReason?: string;

  rawApplication: any;
}

@Component({
  selector: 'app-application-details',
  imports: [RouterLink],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css'
})
export class ApplicationDetails implements OnInit {

  applicationId?: number;

  application = signal<ApplicationDetailsData | undefined>(undefined);

  isLoading = signal(true);

  errorMessage = signal('');


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}


  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'No application was selected.'
      );

      return;
    }

    this.applicationId = Number(id);

    if (Number.isNaN(this.applicationId)) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Invalid application number.'
      );

      return;
    }

    this.loadApplication();
  }


  private loadApplication(): void {

    if (this.applicationId === undefined) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService
      .getApplication(this.applicationId)
      .subscribe({

        next: (application) => {

          this.application.set(
            this.mapApplication(application)
          );

          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load application:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'We could not load this application.'
          );
        }
      });
  }


  private mapApplication(
    application: any
  ): ApplicationDetailsData {

    return {

      id: application.id,

      loanName:
        this.getLoanName(application),

      amount:
        Number(application.requestedAmount),

      status:
        application.status,

      submittedDate:
        this.formatDate(
          application.submittedAt
        ),

      reviewedDate:
        application.reviewedAt
          ? this.formatDate(
              application.reviewedAt
            )
          : undefined,

      rejectionReason:
        application.rejectionReason ||
        undefined,

      rawApplication:
        application
    };
  }


  private getLoanName(
    application: any
  ): string {

    if (
      application.institution !== undefined ||
      application.studyCost !== undefined
    ) {
      return 'Student Loan';
    }

    if (
      application.vehiclePrice !== undefined ||
      application.vehicleType !== undefined
    ) {
      return 'Vehicle Finance';
    }

    if (
      application.propertyPrice !== undefined ||
      application.propertyAddress !== undefined
    ) {
      return 'Home Loan';
    }

    if (
      application.totalDebt !== undefined ||
      application.numberOfDebts !== undefined
    ) {
      return 'Debt Consolidation';
    }

    /*
      Personal and Revolving currently have
      almost identical fields in the API response.
    */
    return 'Personal / Revolving Loan';
  }


  formatAmount(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-ZA',
      {
        style: 'currency',
        currency: 'ZAR',
        maximumFractionDigits: 0
      }
    ).format(amount);
  }


  formatDate(
    date: string
  ): string {

    if (!date) {
      return 'Not available';
    }

    return new Intl.DateTimeFormat(
      'en-ZA',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );
  }


  getStatusLabel(
    status: string
  ): string {

    return status
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      );
  }
}