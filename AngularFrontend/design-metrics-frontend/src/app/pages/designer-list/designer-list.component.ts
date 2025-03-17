import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Designer {
  id: number;
  userName?: string;
  email?: string;
  roleId: number;
}

interface Design {
  designId: number;
  designInput: string;
  designTitle: string;
  description?: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-designer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designer-list.component.html',
  styleUrls: ['./designer-list.component.css'],
})
export class DesignerListComponent implements OnInit {
  designers: Designer[] = [];
  filteredDesigners: Designer[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  selectedDesigner: Designer | null = null;
  designerDesigns: Design[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchDesigners();
  }

  fetchDesigners(): void {
    this.isLoading = true;
    this.http.get<Designer[]>('http://localhost:3000/api/users').subscribe({
      next: (data) => {
        this.designers = data.filter((user) => user.roleId === 2);
        this.filteredDesigners = [...this.designers];
        this.error = null;
      },
      error: () => {
        this.error = 'Failed to load designers';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  fetchDesignerDesigns(designer: Designer): void {
    this.isLoading = true;
    this.http.get<Design[]>('http://localhost:3002/api/designs').subscribe({
      next: (data) => {
        this.designerDesigns = data.filter(
          (design) =>
            design.createdByName.toLowerCase() ===
            designer.userName?.toLowerCase()
        );
        this.error = null;
      },
      error: () => {
        this.error = 'Failed to load designs';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  filterDesigners(): void {
    const searchLower = this.searchQuery.toLowerCase();
    this.filteredDesigners = this.designers.filter(
      (designer) =>
        designer.userName?.toLowerCase().includes(searchLower) ||
        designer.email?.toLowerCase().includes(searchLower)
    );
  }

  handleGoToDashboard(): void {
    this.router.navigate(['/user-dashboard']);
  }

  handleViewDesigns(designer: Designer): void {
    this.selectedDesigner = designer;
    this.fetchDesignerDesigns(designer);
    this.searchQuery = '';
  }

  handleBackToDesigners(): void {
    this.selectedDesigner = null;
    this.designerDesigns = [];
  }
}
