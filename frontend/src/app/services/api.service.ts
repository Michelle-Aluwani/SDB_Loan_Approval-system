import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl =
    'https://sdb-loan-api.michellealuwani.blitz.cloud';

  constructor(private http: HttpClient) {}


  // ==========================================
  // AUTHENTICATION
  // ==========================================

  register(data: any): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/api/auth/register`,
      data
    );
  }


  login(
    email: string,
    password: string
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/api/auth/login`,
      {
        email: email,
        password: password
      }
    );
  }


  // ==========================================
  // CUSTOMER LOAN APPLICATIONS
  // ==========================================

  submitLoan(
    loanType: string,
    data: any
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/api/applications/${loanType}`,
      data
    );
  }


  getCustomerApplications(
    customerId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/api/applications/customer/${customerId}`
    );
  }


  getApplication(
    applicationId: number
  ): Observable<any> {

    return this.http.get(
      `${this.baseUrl}/api/applications/${applicationId}`
    );
  }


  cancelApplication(
    applicationId: number,
    customerId: number
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}/api/applications/${applicationId}/cancel/customer/${customerId}`,
      {}
    );
  }


  // ==========================================
  // ADMIN APPLICATION QUEUE
  // ==========================================

  getAvailableApplications():
    Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/api/admin/applications/available`
    );
  }


  claimApplication(
    applicationId: number,
    employeeEmail: string
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}/api/admin/applications/${applicationId}/claim`,
      {
        employeeEmail: employeeEmail
      }
    );
  }


  // ==========================================
  // ADMIN DECISIONS
  // ==========================================

  approveApplication(
    applicationId: number,
    employeeEmail: string
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}/api/admin/applications/${applicationId}/approve`,
      {
        employeeEmail: employeeEmail
      }
    );
  }


  rejectApplication(
    applicationId: number,
    employeeEmail: string,
    reason: string
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}/api/admin/applications/${applicationId}/reject`,
      {
        employeeEmail: employeeEmail,
        reason: reason
      }
    );
  }


  // ==========================================
  // ADMIN REVIEW HISTORY
  // ==========================================

  getReviewedApplications(
    employeeEmail: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/api/admin/applications/reviewed-by`,
      {
        params: {
          employeeEmail: employeeEmail
        }
      }
    );
  }
  
  getUserProfile(userId: number): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/api/auth/users/${userId}`
  );
}
}