import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  login(): void {

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage.set('Please enter your email and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService.login(this.email, this.password).subscribe({

      next: (user) => {

        // Save the logged-in user so the rest of the website
        // knows which customer/admin is using the system.
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.isLoading.set(false);

        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },

      error: (error) => {
        console.error('Login failed:', error);

        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password.');
      }
    });
  }
}