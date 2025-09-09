import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { TrendingCoderAccuracyDashboardComponent } from './trending-coder-accuracy-dashboard.component';

describe('TrendingCoderAccuracyDashboardComponent Logic Tests', () => {
  let component: TrendingCoderAccuracyDashboardComponent;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    component = new TrendingCoderAccuracyDashboardComponent(messageServiceSpy);
    messageService = messageServiceSpy;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle empty data correctly', () => {
    spyOn(console, 'warn');
    
    component.handleChartWithZeroAnnotations([]);
    
    expect(component.showChart).toBe(false);
    expect(component.noDataMessage).toBe('No data available for the selected period');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Chart Information',
      detail: 'No data available for the selected period'
    });
    expect(console.warn).toHaveBeenCalledWith('Empty dataset provided');
  });

  it('should handle invalid data structure with non-array input', () => {
    spyOn(console, 'error');
    
    component.handleChartWithZeroAnnotations(null as any);
    
    expect(component.showChart).toBe(false);
    expect(component.errorMessage).toBe('Invalid data format: Expected array of coder data');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Chart Error',
      detail: 'Invalid data format: Expected array of coder data'
    });
    expect(console.error).toHaveBeenCalledWith('Invalid data structure: Expected array, received:', 'object');
  });

  it('should handle invalid data entries', () => {
    spyOn(console, 'error');
    
    // Test with invalid data
    const invalidData = [
      { name: 'John', accuracy: 'invalid', period: '2024-01', taskCount: 50 }
    ] as any;
    
    component.handleChartWithZeroAnnotations(invalidData);
    
    expect(component.showChart).toBe(false);
    expect(component.errorMessage).toContain('invalid data entries');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Chart Error',
      detail: jasmine.stringContaining('invalid data entries')
    });
  });

  it('should process valid data correctly', () => {
    spyOn(console, 'log');
    
    const validData = [
      { name: 'John Doe', accuracy: 95.5, period: '2024-01', taskCount: 50 },
      { name: 'Jane Smith', accuracy: 87.2, period: '2024-01', taskCount: 45 },
      { name: 'John Doe', accuracy: 96.1, period: '2024-02', taskCount: 52 }
    ];
    
    component.handleChartWithZeroAnnotations(validData);
    
    expect(component.showChart).toBe(true);
    expect(component.chartData).toBeDefined();
    expect(component.chartData?.labels).toEqual(['2024-01', '2024-02']);
    expect(component.chartData?.datasets).toBeDefined();
    expect(component.chartData?.datasets.length).toBe(2); // John Doe and Jane Smith
    expect(console.log).toHaveBeenCalledWith('Chart data successfully processed and ready for rendering');
  });

  it('should handle processDataWithZeroAnnotations with empty data', () => {
    spyOn(console, 'warn');
    
    const result = component.processDataWithZeroAnnotations([]);
    
    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalledWith('processDataWithZeroAnnotations: Empty dataset provided');
  });

  it('should fill missing data points with zeros', () => {
    const validData = [
      { name: 'John Doe', accuracy: 95.5, period: '2024-01', taskCount: 50 },
      { name: 'Jane Smith', accuracy: 87.2, period: '2024-02', taskCount: 45 }
    ];
    
    const result = component.processDataWithZeroAnnotations(validData);
    
    expect(result).toBeDefined();
    expect(result?.labels).toEqual(['2024-01', '2024-02']);
    
    // John Doe should have data for 2024-01 but 0 for 2024-02
    const johnDataset = result?.datasets.find(d => d.label === 'John Doe');
    expect(johnDataset?.data).toEqual([95.5, 0]);
    
    // Jane Smith should have 0 for 2024-01 but data for 2024-02
    const janeDataset = result?.datasets.find(d => d.label === 'Jane Smith');
    expect(janeDataset?.data).toEqual([0, 87.2]);
  });

  it('should validate data structure correctly', () => {
    spyOn(console, 'log');
    spyOn(console, 'error');
    
    const validData = [
      { name: 'John Doe', accuracy: 95.5, period: '2024-01', taskCount: 50 }
    ];
    
    const result = (component as any).validateDataStructure(validData);
    
    expect(result).toBe(true);
    expect(console.log).toHaveBeenCalledWith('Data validation successful: 1 valid entries found');
  });

  it('should reject data with invalid accuracy values', () => {
    spyOn(console, 'error');
    
    const invalidData = [
      { name: 'John Doe', accuracy: 150, period: '2024-01', taskCount: 50 } // Invalid: > 100%
    ];
    
    const result = (component as any).validateDataStructure(invalidData);
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Invalid data items found:', jasmine.any(Array));
  });

  it('should handle processDataWithZeroAnnotations with invalid data gracefully', () => {
    // Test with null input
    const result1 = component.processDataWithZeroAnnotations(null as any);
    expect(result1).toBeNull();
    
    // Test with extremely malformed data - the function should still process it
    const invalidData = [{ name: undefined, accuracy: undefined, period: undefined }] as any;
    const result2 = component.processDataWithZeroAnnotations(invalidData);
    
    // The function handles edge cases gracefully and may return a result
    // The key is that it doesn't throw an error
    expect(() => component.processDataWithZeroAnnotations(invalidData)).not.toThrow();
  });
});
