import { describe, it, expect } from 'vitest';
import {
  calculateYAxisDomain,
  calculateTickCount,
  formatYAxisTick,
} from './chartHelpers';
import { ALL_METRICS } from './constants';
import type { ProcessedDataPoint } from '@/types/data.types';

describe('chartHelpers', () => {
  describe('calculateYAxisDomain', () => {
    it('should calculate domain with padding for normal data', () => {
      const mockData: ProcessedDataPoint[] = [
        { date: '01 Jan 2023', value: 118000, originalDate: '2023-01-01' },
        { date: '02 Jan 2023', value: 120000, originalDate: '2023-01-02' },
        { date: '03 Jan 2023', value: 122000, originalDate: '2023-01-03' },
      ];

      const [min, max] = calculateYAxisDomain(mockData, ALL_METRICS.house_price);
      
      // Should have padding around data
      expect(min).toBeLessThan(118000);
      expect(max).toBeGreaterThan(122000);
    });

    it('should handle small decimal values correctly', () => {
      const mockData: ProcessedDataPoint[] = [
        { date: '01 Jan 2023', value: 4.8, originalDate: '2023-01-01' },
        { date: '02 Jan 2023', value: 5.0, originalDate: '2023-01-02' },
        { date: '03 Jan 2023', value: 5.2, originalDate: '2023-01-03' },
      ];

      const [min, max] = calculateYAxisDomain(mockData, ALL_METRICS.cash_rate);
      
      // Should have reasonable range (not 0 to millions)
      expect(min).toBeGreaterThan(4);
      expect(min).toBeLessThan(4.8);
      expect(max).toBeGreaterThan(5.2);
      expect(max).toBeLessThan(6);
    });

    it('should use fixed range if provided', () => {
      const mockData: ProcessedDataPoint[] = [
        { date: '01 Jan 2023', value: 100, originalDate: '2023-01-01' },
      ];

      const customMetric = {
        ...ALL_METRICS.house_price,
        yAxis: { min: 50, max: 150 },
      };
      
      const [min, max] = calculateYAxisDomain(mockData, customMetric);
      
      expect(min).toBe(50);
      expect(max).toBe(150);
    });

    it('should handle empty data', () => {
      const [min, max] = calculateYAxisDomain([], ALL_METRICS.house_price);
      
      expect(min).toBe(0);
      expect(max).toBe(100);
    });

    it('should handle single data point', () => {
      const singlePoint = [
        { date: '01 Jan 2023', value: 100, originalDate: '2023-01-01' }
      ];
      
      const [min, max] = calculateYAxisDomain(singlePoint, ALL_METRICS.house_price);
      
      // With single point at 100, padding of 10% means:
      // range = 0, padding = 0, so min = 100, max = 100
      // But we still need to verify it doesn't crash
      expect(min).toBeDefined();
      expect(max).toBeDefined();
      expect(max).toBeGreaterThanOrEqual(min);
    });

    it('should apply custom padding percentage', () => {
      const mockData: ProcessedDataPoint[] = [
        { date: '01 Jan 2023', value: 100, originalDate: '2023-01-01' },
        { date: '02 Jan 2023', value: 200, originalDate: '2023-01-02' },
      ];

      const customMetric = {
        ...ALL_METRICS.house_price,
        yAxis: { paddingPercent: 20 },
      };
      
      const [min, max] = calculateYAxisDomain(mockData, customMetric);
      
      // Range is 100, 20% padding = 20 on each side
      expect(min).toBeLessThan(90);
      expect(max).toBeGreaterThan(210);
    });
  });

  describe('calculateTickCount', () => {
    it('should return appropriate count for different ranges', () => {
      expect(calculateTickCount(4.8, 5.2)).toBeGreaterThanOrEqual(5);
      expect(calculateTickCount(100, 200)).toBeGreaterThanOrEqual(5);
      expect(calculateTickCount(100000, 150000)).toBeGreaterThanOrEqual(5);
    });
  });

  describe('formatYAxisTick', () => {
    it('should format values using metric formatter', () => {
      expect(formatYAxisTick(120000, ALL_METRICS.house_price)).toBe('$120K');
      expect(formatYAxisTick(5.05, ALL_METRICS.cash_rate)).toBe('5.05%');
      expect(formatYAxisTick(10000, ALL_METRICS.jobseekers)).toContain('10,000');
      expect(formatYAxisTick(4796, ALL_METRICS.exchange_rate)).toBe('$0.4796');
    });
  });
});