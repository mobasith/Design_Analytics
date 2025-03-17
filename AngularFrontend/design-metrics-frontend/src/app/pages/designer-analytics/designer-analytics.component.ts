import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-designer-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './designer-analytics.component.html',
  styleUrls: ['./designer-analytics.component.css'],
})
export class DesignerAnalyticsComponent {
  performanceData = [
    { month: 'Jan', views: 1200, likes: 450, downloads: 230 },
    { month: 'Feb', views: 1500, likes: 600, downloads: 310 },
    { month: 'Mar', views: 1800, likes: 750, downloads: 400 },
    { month: 'Apr', views: 2100, likes: 900, downloads: 520 },
    { month: 'May', views: 2400, likes: 1050, downloads: 650 },
  ];

  designCategoryData = [
    { name: 'UI/UX', value: 40 },
    { name: 'Branding', value: 30 },
    { name: 'Illustrations', value: 20 },
    { name: 'Marketing', value: 10 },
  ];

  performanceChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Views', data: [1200, 1500, 1800, 2100, 2400], backgroundColor: 'rgba(59, 130, 246, 0.8)' },
      { label: 'Likes', data: [450, 600, 750, 900, 1050], backgroundColor: 'rgba(16, 185, 129, 0.8)' },
      { label: 'Downloads', data: [230, 310, 400, 520, 650], backgroundColor: 'rgba(244, 63, 94, 0.8)' },
    ],
  };

  categoryChartData: ChartData<'pie'> = {
    labels: ['UI/UX', 'Branding', 'Illustrations', 'Marketing'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  COLORS = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(244, 63, 94, 0.8)',
    'rgba(147, 51, 234, 0.8)',
  ];

  constructor(private router: Router) {}

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  navigateTo(path: string | null) {
    if (path) {
      this.router.navigate([path]);
    }
  }
}
