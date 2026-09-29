import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  idNumber = '';
  phoneNumber = '';
  residentialAddress = '';

  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}


  register(): void {

    this.errorMessage.set('');

    if (
      !this.fullName.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.idNumber.trim() ||
      !this.phoneNumber.trim() ||
      !this.residentialAddress.trim()
    ) {
      this.errorMessage.set('Please complete all fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Your passwords do not match.');
      return;
    }

    this.isLoading.set(true);

    const registrationData = {
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      password: this.password,
      idNumber: this.idNumber.trim(),
      phoneNumber: this.phoneNumber.trim(),
      residentialAddress: this.residentialAddress.trim()
    };


    this.apiService.register(registrationData).subscribe({

      next: (user) => {

        localStorage.setItem(
          'currentUser',
          JSON.stringify(user)
        );

        this.isLoading.set(false);

        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },

      error: (error) => {

        console.error(
          'Registration failed:',
          error
        );

        this.isLoading.set(false);

        if (error.status === 409) {
          this.errorMessage.set(
            'An account with this email already exists.'
          );
        } else {
          this.errorMessage.set(
            'We could not create your account. Please check your details and try again.'
          );
        }
      }

    });
  }
}