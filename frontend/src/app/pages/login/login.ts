import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  constructor(private router: Router) {}

  login(): void {
    if (this.email.trim() && this.password.trim()) {

      // TEMPORARY LOGIN
      // Later Spring Boot will authenticate the real user.
      localStorage.setItem('demoUserEmail', this.email);

      this.router.navigate(['/dashboard']);
    }
  }
}