import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

interface CoderData {
  name: string;
  accuracy: number;
  period: string;
  taskCount: number;
}

interface ChartData {
  labels: string[];
  datasets: any[];
}

@Component({
  selector: 'app-trending-coder-accuracy-dashboard',
  templateUrl: './trending-coder-accuracy-dashboard.component.html',
  styleUrl: './trending-coder-accuracy-dashboard.component.scss'
})
export class TrendingCoderAccuracyDashboardComponent implements OnInit {
  
  chartData: ChartData | null = null;
  chartOptions: any;
  errorMessage: string = '';
  showChart: boolean = false;
  noDataMessage: string = '';

  // Sample data - in a real app this would come from a service
  private sampleCoderData: CoderData[] = [
    { name: 'John Doe', accuracy: 95.5, period: '2024-01', taskCount: 50 },
    { name: 'Jane Smith', accuracy: 87.2, period: '2024-01', taskCount: 45 },
    { name: 'Bob Johnson', accuracy: 92.8, period: '2024-01', taskCount: 38 },
    { name: 'John Doe', accuracy: 96.1, period: '2024-02', taskCount: 52 },
    { name: 'Jane Smith', accuracy: 89.4, period: '2024-02', taskCount: 48 },
    { name: 'Bob Johnson', accuracy: 91.2, period: '2024-02', taskCount: 41 },
  ];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.initializeChartOptions();
    this.loadDashboardData();
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Coder Accuracy Trends'
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time Period'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Accuracy (%)'
          },
          min: 0,
          max: 100
        }
      }
    };
  }

  private loadDashboardData(): void {
    try {
      // Simulate different data scenarios
      const dataScenario = this.getDataScenario();
      
      let rawData: CoderData[] = [];
      
      switch (dataScenario) {
        case 'empty':
          rawData = [];
          break;
        case 'sparse':
          rawData = this.sampleCoderData.slice(0, 2); // Very limited data
          break;
        case 'normal':
        default:
          rawData = this.sampleCoderData;
          break;
      }

      this.handleChartWithZeroAnnotations(rawData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.displayError('Failed to load dashboard data. Please try again.');
    }
  }

  /**
   * Enhanced validation function to check for valid data structures before processing them
   * Provides more descriptive error messages and handles various edge cases
   */
  handleChartWithZeroAnnotations(data: CoderData[]): void {
    try {
      // Enhanced validation
      if (!this.validateDataStructure(data)) {
        return; // Error already handled in validateDataStructure
      }

      // Process data with enhanced error handling
      const processedData = this.processDataWithZeroAnnotations(data);
      
      if (!processedData) {
        this.showFallbackVisualization('Unable to process chart data');
        return;
      }

      // Final validation before rendering
      if (this.isValidChartData(processedData)) {
        this.chartData = processedData;
        this.showChart = true;
        this.errorMessage = '';
        this.noDataMessage = '';
        console.log('Chart data successfully processed and ready for rendering');
      } else {
        this.showFallbackVisualization('Processed data is not suitable for chart rendering');
      }
    } catch (error) {
      console.error('Error in handleChartWithZeroAnnotations:', error);
      this.displayError('Chart rendering failed due to data processing error');
    }
  }

  /**
   * Enhanced data processing function that handles empty datasets and sparse data appropriately
   * Includes data transformation logic and better error handling
   */
  processDataWithZeroAnnotations(data: CoderData[]): ChartData | null {
    try {
      if (!data || data.length === 0) {
        console.warn('processDataWithZeroAnnotations: Empty dataset provided');
        return null;
      }

      // Group data by period and coder
      const groupedData = this.groupDataByPeriodAndCoder(data);
      
      if (Object.keys(groupedData.periods).length === 0) {
        console.warn('processDataWithZeroAnnotations: No valid periods found in data');
        return null;
      }

      // Create chart datasets
      const datasets = this.createChartDatasets(groupedData);
      
      if (datasets.length === 0) {
        console.warn('processDataWithZeroAnnotations: No valid datasets created');
        return null;
      }

      // Fill in zero annotations for missing data points
      const enhancedDatasets = this.fillMissingDataPoints(datasets, groupedData.periods);

      return {
        labels: Object.keys(groupedData.periods).sort(),
        datasets: enhancedDatasets
      };
    } catch (error) {
      console.error('Error in processDataWithZeroAnnotations:', error);
      return null;
    }
  }

  private validateDataStructure(data: any): boolean {
    if (!Array.isArray(data)) {
      console.error('Invalid data structure: Expected array, received:', typeof data);
      this.displayError('Invalid data format: Expected array of coder data');
      return false;
    }

    if (data.length === 0) {
      console.warn('Empty dataset provided');
      this.showFallbackVisualization('No data available for the selected period');
      return false;
    }

    // Validate data structure
    const invalidItems = data.filter(item => 
      !item || 
      typeof item.name !== 'string' || 
      typeof item.accuracy !== 'number' || 
      typeof item.period !== 'string' ||
      isNaN(item.accuracy) ||
      item.accuracy < 0 || 
      item.accuracy > 100
    );

    if (invalidItems.length > 0) {
      console.error('Invalid data items found:', invalidItems);
      this.displayError(`Found ${invalidItems.length} invalid data entries. Please check data format.`);
      return false;
    }

    console.log(`Data validation successful: ${data.length} valid entries found`);
    return true;
  }

  private groupDataByPeriodAndCoder(data: CoderData[]): any {
    const periods: { [key: string]: boolean } = {};
    const coders: { [key: string]: { [period: string]: number } } = {};

    data.forEach(item => {
      periods[item.period] = true;
      
      if (!coders[item.name]) {
        coders[item.name] = {};
      }
      
      coders[item.name][item.period] = item.accuracy;
    });

    return { periods, coders };
  }

  private createChartDatasets(groupedData: any): any[] {
    const colors = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)', 
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)'
    ];

    return Object.keys(groupedData.coders).map((coderName, index) => {
      const color = colors[index % colors.length];
      
      return {
        label: coderName,
        data: Object.keys(groupedData.periods).sort().map(period => 
          groupedData.coders[coderName][period] || null
        ),
        borderColor: color,
        backgroundColor: color + '20', // Add transparency
        tension: 0.1,
        spanGaps: true, // Connect points even when there are null values
      };
    });
  }

  private fillMissingDataPoints(datasets: any[], periods: { [key: string]: boolean }): any[] {
    const sortedPeriods = Object.keys(periods).sort();
    
    return datasets.map(dataset => {
      // Fill missing data points with zero or interpolated values
      const enhancedData = sortedPeriods.map((_, index) => {
        const currentValue = dataset.data[index];
        
        if (currentValue === null || currentValue === undefined) {
          // For missing data points, we can either use 0 or interpolate
          // Here we'll use 0 as specified in the function name
          return 0;
        }
        
        return currentValue;
      });

      return {
        ...dataset,
        data: enhancedData
      };
    });
  }

  private isValidChartData(data: ChartData): boolean {
    if (!data || !data.labels || !data.datasets) {
      console.error('Invalid chart data structure');
      return false;
    }

    if (data.labels.length === 0 || data.datasets.length === 0) {
      console.error('Chart data contains empty labels or datasets');
      return false;
    }

    // Validate each dataset
    const invalidDatasets = data.datasets.filter(dataset => 
      !dataset.label || !Array.isArray(dataset.data) || dataset.data.length === 0
    );

    if (invalidDatasets.length > 0) {
      console.error('Found invalid datasets:', invalidDatasets);
      return false;
    }

    return true;
  }

  private showFallbackVisualization(message: string): void {
    this.showChart = false;
    this.noDataMessage = message;
    this.errorMessage = '';
    console.info('Showing fallback visualization:', message);
    
    this.messageService.add({
      severity: 'info',
      summary: 'Chart Information',
      detail: message
    });
  }

  private displayError(message: string): void {
    this.showChart = false;
    this.errorMessage = message;
    this.noDataMessage = '';
    console.error('Dashboard error:', message);
    
    this.messageService.add({
      severity: 'error',
      summary: 'Chart Error',
      detail: message
    });
  }

  // Helper method to simulate different data scenarios for testing
  private getDataScenario(): 'empty' | 'sparse' | 'normal' {
    // In a real app, this would be determined by actual data conditions
    // For demo purposes, we'll cycle through different scenarios
    const scenarios = ['normal', 'sparse', 'empty'];
    const hash = Date.now() % 3;
    return scenarios[hash] as 'empty' | 'sparse' | 'normal';
  }

  // Public methods for testing different scenarios
  testEmptyData(): void {
    console.log('Testing with empty data...');
    this.handleChartWithZeroAnnotations([]);
  }

  testSparseData(): void {
    console.log('Testing with sparse data...');
    this.handleChartWithZeroAnnotations(this.sampleCoderData.slice(0, 2));
  }

  testNormalData(): void {
    console.log('Testing with normal data...');
    this.handleChartWithZeroAnnotations(this.sampleCoderData);
  }

  refreshChart(): void {
    console.log('Refreshing chart data...');
    this.loadDashboardData();
  }
}
