import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface UserData {
  userId: number;
  userName: string;
  email: string;
  roleId: number;
  role: string;
}

interface Design {
  category: string;
  _id: string;
  designId: number;
  designInput: string;
  designTitle: string;
  description: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  // viewMode: 'grid' | 'list' = 'grid';
  viewMode: string = 'grid';
  selectedCategory: string = 'all';
  searchQuery: string = '';
  latestDesigns: Design[] = [];
  loading: boolean = true;
  error: string | null = null;
  userData: UserData | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchDesigns();
  }

  fetchUserData(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userData = {
          userId: Number(payload.userId),
          userName: payload.userName,
          email: payload.email,
          roleId: payload.roleId,
          role: payload.roleId === 1 ? 'User' : 'Designer'
        };
      } catch (error) {
        console.error('Error parsing JWT token:', error);
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    }
  }

  fetchDesigns(): void {
    this.http.get<Design[]>('http://localhost:3002/api/designs').subscribe({
      next: (data) => {
        this.latestDesigns = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching designs:', err);
        this.error = 'Failed to load designs';
        this.loading = false;
      }
    });
  }

  get filteredDesigns(): Design[] {
    return this.latestDesigns.filter(
      (design) =>
        (this.selectedCategory === 'all' || design.category === this.selectedCategory) &&
        (design.designTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          design.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  handleViewDesign(designId: number): void {
    this.router.navigate([`/designs/${designId}`]);
  }

  handleNavigate(path: string): void {
    this.router.navigate([path]);
  }
}
