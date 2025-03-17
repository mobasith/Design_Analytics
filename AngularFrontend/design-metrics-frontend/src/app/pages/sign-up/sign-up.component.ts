import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

// Define types for form data and errors
interface FormData {
  userId: string;
  userName: string;
  email: string;
  password: string;
  roleId: number;
}

interface FormErrors {
  userName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  // Form data state
  formData: FormData = {
    userId: Date.now().toString(),
    userName: '',
    email: '',
    password: '',
    roleId: 1,
  };

  // Error states
  formErrors: FormErrors = {
    userName: '',
    email: '',
    password: '',
  };
  
  isLoading: boolean = false;
  apiError: string = '';

  constructor(private router: Router) {}

  // Validation functions
  validatePassword(password: string): string {
    if (password.length < 8)
      return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password))
      return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password))
      return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(password))
      return 'Password must contain at least one number';
    if (!/[@$!%*?&#]/.test(password))
      return 'Password must contain at least one special character';
    return '';
  }

  validateEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  }

  validateUserName(userName: string): string {
    if (userName.length < 3)
      return 'Username must be at least 3 characters long';
    if (userName.length > 20) return 'Username must be less than 20 characters';
    return '';
  }

  // Handle input changes
  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    this.formData = {
      ...this.formData,
      [name]: name === 'roleId' ? parseInt(value) : value,
    };

    // Clear API error when user starts typing
    this.apiError = '';

    // Validate fields
    if (name === 'password') {
      this.formErrors.password = this.validatePassword(value);
    } else if (name === 'email') {
      this.formErrors.email = this.validateEmail(value);
    } else if (name === 'userName') {
      this.formErrors.userName = this.validateUserName(value);
    }
  }

  // Handle form submission
  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.apiError = '';

    // Validate all fields before submission
    const errors = {
      userName: this.validateUserName(this.formData.userName),
      email: this.validateEmail(this.formData.email),
      password: this.validatePassword(this.formData.password),
    };

    this.formErrors = errors;

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== '')) {
      return;
    }

    this.isLoading = true;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/register',
        this.formData
      );

      if (response.data) {
        // Show success message
        alert('Registration successful!');
        // Redirect to login page
        this.router.navigate(['/signin']);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        this.apiError = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = error.response.data.errors
          .map((err: any) => err.msg)
          .join(', ');
        this.apiError = backendErrors;
      } else {
        this.apiError = 'An error occurred during registration. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
