import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { MyApplications } from './pages/my-applications/my-applications';
import { ApplicationDetails } from './pages/application-details/application-details';
import { ApplyLoan } from './pages/apply-loan/apply-loan';
import { LoanQualification } from './pages/loan-qualification/loan-qualification';
import { Dashboard as AdminDashboard } from './pages/admin/dashboard/dashboard';
import { Applications as AdminApplications } from './pages/admin/applications/applications';
import { ApplicationReview } from './pages/admin/application-review/application-review';
export const routes: Routes = [
  {
    path: '',
    component: Landing
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'profile',
    component: Profile
  },
  {
    path: 'applications',
    component: MyApplications
  },
  {
    path: 'applications/:id',
    component: ApplicationDetails
  },
  {
    path: 'apply',
    component: ApplyLoan
  },
  {
    path: 'qualify/:type',
    component: LoanQualification
  },
  {
    path: 'admin',
    component: AdminDashboard
  },

  {
    path: 'admin/applications',
    component: AdminApplications
  },

  {
    path: 'admin/applications/:id',
    component: ApplicationReview
  },
  {
    path: '**',
    redirectTo: ''
  }
];