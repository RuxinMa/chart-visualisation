import { describe, it, expect } from 'vitest';
import {
  validateData,
  cleanData,
  sortByDate,
  extractMetric,
  calculateAverage,
  removeDuplicateDates,
} from './dataTransform';
import type { RawDataPoint } from '@/types/data.types';

describe('dataTransform', () => {
  const mockValidData: RawDataPoint[] = [
    {
      date: '2023-01-01',
      median_house_price_syd: 120000,
      jobseeker_recipients: 10000,
      rba_cash_rate: 5.0,
      aud_usd_exchange: 5000,
    },
    {
      date: '2023-01-02',
      median_house_price_syd: 121000,
      jobseeker_recipients: 10100,
      rba_cash_rate: 5.1,
      aud_usd_exchange: 5050,
    },
  ];

  describe('validateData', () => {
    it('should validate correct data structure', () => {
      const result = validateData(mockValidData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-array data', () => {
      const result = validateData({} as any);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('must be an array');
    });

    it('should reject empty array', () => {
      const result = validateData([]);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('empty');
    });

    it('should detect missing date field', () => {
      const invalidData = [{ median_house_price_syd: 120000 }];
      const result = validateData(invalidData as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('date'))).toBe(true);
    });

    it('should detect invalid date format', () => {
      const invalidData = [
        { 
          date: '01-01-2023', // Wrong format
          median_house_price_syd: 120000,
          jobseeker_recipients: 10000,
          rba_cash_rate: 5.0,
          aud_usd_exchange: 5000,
        }
      ];
      const result = validateData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('date format'))).toBe(true);
    });

    it('should detect missing numeric fields', () => {
      const invalidData = [
        { 
          date: '2023-01-01',
          median_house_price_syd: 120000,
          // Missing other fields
        }
      ];
      const result = validateData(invalidData as any);
      expect(result.valid).toBe(false);
    });
  });

  describe('cleanData', () => {
    it('should handle null values', () => {
      const dirtyData = [
        {
          date: '2023-01-01',
          median_house_price_syd: null as any,
          jobseeker_recipients: 10000,
          rba_cash_rate: 5.0,
          aud_usd_exchange: 5000,
        },
      ];

      const cleaned = cleanData(dirtyData);
      expect(cleaned[0].median_house_price_syd).toBe(0);
    });

    it('should handle undefined values', () => {
      const dirtyData = [
        {
          date: '2023-01-01',
          median_house_price_syd: 120000,
          jobseeker_recipients: undefined as any,
          rba_cash_rate: 5.0,
          aud_usd_exchange: 5000,
        },
      ];

      const cleaned = cleanData(dirtyData);
      expect(cleaned[0].jobseeker_recipients).toBe(0);
    });

    it('should not modify valid data', () => {
      const cleaned = cleanData(mockValidData);
      expect(cleaned).toEqual(mockValidData);
    });
  });

  describe('sortByDate', () => {
    it('should sort data in ascending order', () => {
      const unsortedData: RawDataPoint[] = [
        { ...mockValidData[1] }, // 2023-01-02
        { ...mockValidData[0] }, // 2023-01-01
      ];

      const sorted = sortByDate(unsortedData);
      expect(sorted[0].date).toBe('2023-01-01');
      expect(sorted[1].date).toBe('2023-01-02');
    });

    it('should not mutate original array', () => {
      const original = [...mockValidData];
      const sorted = sortByDate(original);
      expect(sorted).not.toBe(original);
    });

    it('should handle already sorted data', () => {
      const sorted = sortByDate(mockValidData);
      expect(sorted[0].date).toBe('2023-01-01');
    });
  });

  describe('extractMetric', () => {
    it('should extract house price values', () => {
      const values = extractMetric(mockValidData, 'median_house_price_syd');
      expect(values).toEqual([120000, 121000]);
    });

    it('should extract jobseeker values', () => {
      const values = extractMetric(mockValidData, 'jobseeker_recipients');
      expect(values).toEqual([10000, 10100]);
    });

    it('should return empty array for empty data', () => {
      const values = extractMetric([], 'median_house_price_syd');
      expect(values).toEqual([]);
    });
  });

  describe('calculateAverage', () => {
    it('should calculate average correctly', () => {
      expect(calculateAverage([100, 200, 300])).toBe(200);
      expect(calculateAverage([10, 20, 30, 40])).toBe(25);
    });

    it('should handle single value', () => {
      expect(calculateAverage([100])).toBe(100);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverage([])).toBe(0);
    });

    it('should handle decimal values', () => {
      const avg = calculateAverage([5.5, 4.5, 6.0]);
      expect(avg).toBeCloseTo(5.33, 2);
    });
  });

  describe('removeDuplicateDates', () => {
    it('should remove duplicate dates keeping first occurrence', () => {
      const dataWithDuplicates: RawDataPoint[] = [
        { ...mockValidData[0], date: '2023-01-01' },
        { ...mockValidData[1], date: '2023-01-02' },
        { ...mockValidData[0], date: '2023-01-01' }, // Duplicate
      ];

      const unique = removeDuplicateDates(dataWithDuplicates);
      expect(unique).toHaveLength(2);
      expect(unique[0].date).toBe('2023-01-01');
      expect(unique[1].date).toBe('2023-01-02');
    });

    it('should handle data without duplicates', () => {
      const unique = removeDuplicateDates(mockValidData);
      expect(unique).toHaveLength(2);
    });

    it('should handle empty array', () => {
      const unique = removeDuplicateDates([]);
      expect(unique).toEqual([]);
    });
  });
});