import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Design {
  _id: string;
  designId: number;
  designInput: string;
  designTitle: string;
  description: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  commentCount?: number;
}

@Component({
  selector: 'app-all-designs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-designs.component.html',
  styleUrls: ['./all-designs.component.css'],
})
export class AllDesignsComponent implements OnInit {
  designs: Design[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  sortBy = 'newest';

  ngOnInit(): void {
    this.fetchDesigns();
  }

  fetchDesigns(): void {
    this.loading = true;
    fetch('http://localhost:3002/api/designs')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch designs');
        }
        return response.json();
      })
      .then((data: Design[]) => {
        this.designs = data;
        this.error = null;
      })
      .catch((err) => {
        this.error = err instanceof Error ? err.message : 'An unknown error occurred';
      })
      .finally(() => {
        this.loading = false;
      });
  }

  handleLike(id: string): void {
    this.designs = this.designs.map((design) =>
      design._id === id
        ? { ...design, likeCount: (design.likeCount || 0) + 1 }
        : design
    );
  }

  handleDashboardRedirect(): void {
    const token = sessionStorage.getItem('token');
    const roleId = token ? JSON.parse(atob(token.split('.')[1])).roleId : null;

    if (roleId === 1) {
      window.location.href = '/user-dashboard';
    } else if (roleId === 2) {
      window.location.href = '/designer-dashboard';
    } else {
      alert('Unable to determine user role');
    }
  }

  filteredAndSortedDesigns(): Design[] {
    return this.designs
      .filter((design) =>
        design.designTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'rating':
            return (b.likeCount || 0) - (a.likeCount || 0);
          default:
            return 0;
        }
      });
  }
}
