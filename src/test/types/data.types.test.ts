import { describe, it, expect } from 'vitest';
import type { RawDataPoint, ProcessedDataPoint, MetricConfig } from '@/types/data.types';

describe('Data Types', () => {
  describe('RawDataPoint', () => {
    it('should have correct structure', () => {
      const mockData: RawDataPoint = {
        date: '2023-01-01',
        median_house_price_syd: 120000,
        jobseeker_recipients: 10000,
        rba_cash_rate: 5.0,
        aud_usd_exchange: 5000,
      };

      expect(mockData).toHaveProperty('date');
      expect(mockData).toHaveProperty('median_house_price_syd');
      expect(mockData).toHaveProperty('jobseeker_recipients');
      expect(mockData).toHaveProperty('rba_cash_rate');
      expect(mockData).toHaveProperty('aud_usd_exchange');
    });
  });

  describe('ProcessedDataPoint', () => {
    it('should have correct structure', () => {
      const mockData: ProcessedDataPoint = {
        date: '01 Jan 2023',
        value: 120000,
        originalDate: '2023-01-01',
      };

      expect(mockData).toHaveProperty('date');
      expect(mockData).toHaveProperty('value');
      expect(mockData.originalDate).toBe('2023-01-01');
    });
  });

  describe('MetricConfig', () => {
    it('should have correct structure', () => {
      const mockConfig: MetricConfig = {
        key: 'median_house_price_syd',
        label: 'House Price',
        color: '#0173B2',
        formatValue: (value: number) => `$${value}`,
        description: 'Test description',
      };

      expect(mockConfig.formatValue(100)).toBe('$100');
    });
  });
});