import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { LucideAngularModule } from 'lucide-angular';

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  PieController,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary Chart.js components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  PieController,
  Filler,
  Tooltip,
  Legend
);
import {
  ScatterController,
} from 'chart.js';

// Register the necessary components, including ScatterController
Chart.register(
  ScatterController,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

import {
  ArcElement, // Import ArcElement for pie/doughnut charts
} from 'chart.js';

// Register necessary components, including ArcElement
Chart.register(
  ScatterController,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement, // Register ArcElement
  Tooltip,
  Legend
);



interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
    LucideAngularModule,
  ],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashboardComponent implements OnInit {
  data: Record<string, any> = {};
  loading = true;
  error: string | null = null;
  columns: string[] = [];
  selectedXAxis = '';
  selectedYAxis = '';

  barChartType: 'bar' = 'bar';
  lineChartType: 'line' = 'line';
  scatterChartType: 'scatter' = 'scatter';
  pieChartType: 'pie' = 'pie';
  donutChartType: 'doughnut' = 'doughnut'; // Fixed type

  barChartOptions: ChartConfiguration['options'] = { responsive: true };
  lineChartOptions: ChartConfiguration['options'] = { responsive: true };
  scatterChartOptions: ChartConfiguration['options'] = { responsive: true };
  pieChartOptions: ChartConfiguration['options'] = { responsive: true };
  donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      legend: { display: true },
    },
    cutout: '60%',
  };
  areaChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      filler: {
        propagate: false,
      },
    },
  };

  barChartData!: ChartConfiguration['data'];
  lineChartData!: ChartConfiguration['data'];
  scatterChartData!: ChartConfiguration['data'];
  pieChartData!: ChartConfiguration['data'];
  donutChartData!: ChartConfiguration<'doughnut'>['data']; // Fixed type
  areaChartData!: ChartConfiguration['data'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3001/api/feedback').subscribe({
      next: (jsonData) => {
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          const arrayData = jsonData[0];
          const availableColumns = Object.keys(arrayData).filter(
            (key) =>
              Array.isArray(arrayData[key]) && !['_id', '__v'].includes(key)
          );

          this.data = arrayData;
          this.columns = availableColumns;

          if (availableColumns.length >= 2) {
            this.selectedXAxis = availableColumns[0];
            this.selectedYAxis = availableColumns[1];
            this.updateCharts();
          }
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to fetch data. Please try again later.';
        this.loading = false;
      },
    });
  }

  updateCharts() {
    const processedData = this.processData();

    this.barChartData = {
      labels: processedData.map((d: ChartData) => d.name),
      datasets: [
        {
          data: processedData.map((d: ChartData) => d.value),
          label: this.selectedYAxis,
          backgroundColor: '#6366f1',
        },
      ],
    };

    this.lineChartData = {
      labels: processedData.map((d: ChartData) => d.name),
      datasets: [
        {
          data: processedData.map((d: ChartData) => d.value),
          label: this.selectedYAxis,
          borderColor: '#6366f1',
          fill: false,
        },
      ],
    };

    this.scatterChartData = {
      datasets: [
        {
          data: processedData.map((d: ChartData) => ({
            x: Number(d.name),
            y: d.value,
          })),
          label: this.selectedYAxis,
          backgroundColor: '#6366f1',
        },
      ],
    };

    this.pieChartData = {
      labels: processedData.map((d: ChartData) => d.name),
      datasets: [
        {
          data: processedData.map((d: ChartData) => d.value),
          backgroundColor: [
            '#6366f1',
            '#ec4899',
            '#8b5cf6',
            '#14b8a6',
            '#f59e0b',
            '#84cc16',
          ],
        },
      ],
    };

    this.donutChartData = {
      labels: processedData.map((d: ChartData) => d.name),
      datasets: [
        {
          data: processedData.map((d: ChartData) => d.value),
          backgroundColor: ['#6366f1', '#ec4899', '#8b5cf6'],
        },
      ],
    };

    this.areaChartData = {
      labels: processedData.map((d: ChartData) => d.name),
      datasets: [
        {
          data: processedData.map((d: ChartData) => d.value),
          label: this.selectedYAxis,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          fill: true,
        },
      ],
    };
  }

  processData(): ChartData[] {
    if (
      !this.data ||
      !this.data[this.selectedXAxis] ||
      !this.data[this.selectedYAxis]
    )
      return [];

    return this.data[this.selectedXAxis].map((value: any, index: number) => ({
      name: String(value),
      value: Number(this.data[this.selectedYAxis][index]),
    }));
  }

  handleDownloadPDF() {
    window.print();
  }

  handleGoBack() {
    window.history.back();
  }
}
