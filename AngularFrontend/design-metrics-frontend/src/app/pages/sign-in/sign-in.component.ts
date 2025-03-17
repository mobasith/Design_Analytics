import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  signInForm: FormGroup;
  isLoading = false;
  apiError = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  // Decode the JWT manually
  private parseJwt(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT', e);
      return null;
    }
  }

  // Handle sign-in
  onSignIn() {
    if (this.signInForm.invalid) return;

    this.isLoading = true;
    this.apiError = '';

    this.http
      .post('http://localhost:3000/api/users/login', this.signInForm.value)
      .subscribe({
        next: (response: any) => {
          const token = response.token;

          if (this.signInForm.value.rememberMe) {
            sessionStorage.setItem('token', token);
          } else {
            sessionStorage.setItem('token', token);
          }

          const decodedToken = this.parseJwt(token);
          if (decodedToken) {
            const roleId = decodedToken.roleId;

            if (roleId === 1) {
              this.router.navigate(['/user-dashboard']);
            } else if (roleId === 2) {
              this.router.navigate(['/designer-dashboard']);
            } else {
              this.apiError = 'Unauthorized role.';
            }
          } else {
            this.apiError = 'Failed to decode token.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 401) {
            this.apiError = 'Invalid email or password.';
          } else {
            this.apiError =
              err.error?.message || 'An error occurred during sign-in.';
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
