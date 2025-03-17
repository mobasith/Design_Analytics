import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  isVideoModalOpen = false;

  currentYear = new Date().getFullYear(); // Define the current year here

  features = [
    {
      icon: 'bar-chart-3',
      title: 'Real-time Analytics',
      description:
        'Track design metrics and performance in real-time with our advanced dashboard',
    },
    {
      icon: 'users',
      title: 'Team Collaboration',
      description:
        'Seamlessly collaborate with your team and stakeholders in one platform',
    },
    {
      icon: 'zap',
      title: 'Instant Insights',
      description:
        'Get actionable insights and recommendations to improve your designs',
    },
    {
      icon: 'target',
      title: 'Goal Tracking',
      description:
        'Set and monitor design goals with our intelligent tracking system',
    },
  ];

  stats = [
    { number: '98%', label: 'Customer Satisfaction' },
    { number: '2x', label: 'Faster Iterations' },
    { number: '500+', label: 'Design Teams' },
    { number: '50M+', label: 'Designs Analyzed' },
  ];

  companies = ['Adobe', 'Figma', 'Sketch', 'InVision'];

  constructor(private router: Router) {}

  navigateToSignIn(): void {
    this.router.navigate(['/signin']);
  }

  toggleVideoModal(): void {
    this.isVideoModalOpen = !this.isVideoModalOpen;
  }
}
