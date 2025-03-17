import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Design {
  id: number;
  name: string;
}

@Component({
  selector: 'app-submit-feedback',
  templateUrl: './submit-feedback.component.html',
  styleUrls: ['./submit-feedback.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class SubmitFeedbackComponent {
  searchTerm: string = '';
  designId: number | null = null;
  designName: string = '';
  Description: string = 'Some feedback';
  file: File | null = null;
  showDesigns: boolean = false;
  isSubmitting: boolean = false;
  error: string = '';
  filteredDesigns: Design[] = [];

  private token: string | null = sessionStorage.getItem('token');

  designs: Design[] = [
    { id: 1, name: 'Design 1' },
    { id: 2, name: 'Design 2' },
    { id: 3, name: 'Design 3' },
    { id: 4, name: 'Design 4' },
    { id: 5, name: 'Design 5' },
  ];

  constructor(private router: Router, private http: HttpClient) {
    this.filteredDesigns = [...this.designs];
  }

  filterDesigns(): void {
    this.filteredDesigns = this.designs.filter((design) =>
      design.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.file = target.files?.[0] || null;
  }

  handleBlur(): void {
    setTimeout(() => {
      this.showDesigns = false;
    }, 100);
  }

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting = true;
    this.error = '';
    //this.feedback=this.feedback;
    console.log(this.Description);

    if (!this.file) {
      this.error = 'Please select a file to upload';
      this.isSubmitting = false;
      return;
    }

    if (!this.Description) {
      this.error = 'Description is required';
      this.isSubmitting = false;
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('description', this.Description);

      if (this.designId) {
        formData.append('design_id', this.designId.toString());
      }

      //const headers = new HttpHeaders();
      const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`);
      const response = await this.http
        .post('http://localhost:3001/api/feedback/upload', formData, {
          headers,
        })
        .toPromise();

      if (response) {
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      this.error = err instanceof Error ? err.message : 'Failed to submit feedback';
    } finally {
      this.isSubmitting = false;
    }
  }

  navigateToMainPage(): void {
    this.router.navigate(['user-dashboard']);
  }
}
