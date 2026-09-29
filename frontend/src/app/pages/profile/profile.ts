import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  currentUser = this.getCurrentUser();

  profile = signal<any>(null);

  isLoading = signal(true);

  errorMessage = signal('');


  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}


  ngOnInit(): void {
    this.loadProfile();
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


  loadProfile(): void {

    if (!this.currentUser?.id) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'You must be logged in to view your profile.'
      );

      return;
    }


    this.isLoading.set(true);
    this.errorMessage.set('');


    this.apiService
      .getUserProfile(this.currentUser.id)
      .subscribe({

        next: (profile) => {

          this.profile.set(profile);

          this.isLoading.set(false);
        },


        error: (error) => {

          console.error(
            'Failed to load profile:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'We could not load your profile.'
          );
        }

      });
  }


  getInitials(): string {

    const name =
      this.profile()?.fullName ||
      this.currentUser?.fullName ||
      'Customer';

    return name
      .split(' ')
      .filter((part: string) => part.length > 0)
      .slice(0, 2)
      .map((part: string) =>
        part.charAt(0).toUpperCase()
      )
      .join('');
  }


  logout(): void {

    localStorage.removeItem(
      'currentUser'
    );

    this.router.navigate(['/']);
  }
}