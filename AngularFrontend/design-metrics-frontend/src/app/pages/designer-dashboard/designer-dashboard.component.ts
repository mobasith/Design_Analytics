import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Design {
  _id: string;
  designId: number;
  designInput: string;
  designTitle: string;
  description?: string;
  createdById: number;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
}

@Component({
  selector: 'app-designer-dashboard',
  standalone: true,
  templateUrl: './designer-dashboard.component.html',
  styleUrls: ['./designer-dashboard.component.css'],
  imports: [FormsModule, CommonModule],
})
export class DesignerDashboardComponent implements OnInit {
  designs: Design[] = [];
  loading: boolean = true;
  error: string | null = null;
  showUploadModal: boolean = false;
  formData = {
    designId: 0,
    designTitle: '',
    description: '',
    designInput: null as File | null,
  };

  private apiBaseUrl = 'http://localhost:3002/api';
  private token: string | null = sessionStorage.getItem('token');

  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    this.checkAuthAndFetchDesigns();
  }

  checkAuthAndFetchDesigns(): void {
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchDesigns();
  }

  fetchDesigns(): void {
    this.loading = true;
    this.error = null;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.get<Design[]>(`${this.apiBaseUrl}/designs/user/me`, { headers }).subscribe({
      next: (data) => {
        this.designs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.error = err.error?.message || 'Failed to fetch designs';
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
        this.loading = false;
      },
    });
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.designInput = input.files[0];
    }
  }

  generateDesignId(): number {
    return Math.floor(Date.now() / 1000);
  }

  handleUpload(): void {
    // Add validation for required fields
    if (!this.formData.designInput) {
      this.error = 'Please select a file';
      return;
    }

    if (!this.formData.designTitle || this.formData.designTitle.trim() === '') {
      this.error = 'Design title is required';
      return;
    }

    console.log('Form data before submission:', {
      designTitle: this.formData.designTitle,
      description: this.formData.description,
      file: this.formData.designInput
    });

    this.loading = true;
    this.error = null;

    const formDataToSend = new FormData();
    const designId = this.generateDesignId();

    formDataToSend.append('designId', designId.toString());
    formDataToSend.append('designTitle', this.formData.designTitle.trim());
    formDataToSend.append('designInput', this.formData.designInput);
    
    if (this.formData.description && this.formData.description.trim()) {
      formDataToSend.append('description', this.formData.description.trim());
    }

    // Log the FormData contents
    formDataToSend.forEach((value, key) => {
      console.log(key, value);
    });

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`);

    this.http.post(`${this.apiBaseUrl}/designs`, formDataToSend, { headers }).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        this.loading = false;
        this.fetchDesigns();
        this.showUploadModal = false;
        this.formData = {
          designId: 0,
          designTitle: '',
          description: '',
          designInput: null,
        };
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.error = err.error?.message || 'Failed to upload design';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  handleLogout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  formatDate(dateString: Date): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}