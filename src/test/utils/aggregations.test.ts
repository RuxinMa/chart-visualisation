import { describe, it, expect } from 'vitest';
import {
  aggregateByWeek,
  aggregateByFortnight,
  aggregateByMonth,
  processDaily,
} from '@/utils/aggregations';
import type { RawDataPoint } from '@/types/data.types';

describe('aggregations', () => {
  // Mock data spanning multiple weeks
  const mockData: RawDataPoint[] = [
    // Week 1: Jan 2-8, 2023 (Monday to Sunday)
    {
      date: '2023-01-02', // Monday
      median_house_price_syd: 100000,
      jobseeker_recipients: 10000,
      rba_cash_rate: 5.0,
      aud_usd_exchange: 5000,
    },
    {
      date: '2023-01-03', // Tuesday
      median_house_price_syd: 102000,
      jobseeker_recipients: 10100,
      rba_cash_rate: 5.1,
      aud_usd_exchange: 5100,
    },
    {
      date: '2023-01-04', // Wednesday
      median_house_price_syd: 104000,
      jobseeker_recipients: 10200,
      rba_cash_rate: 5.2,
      aud_usd_exchange: 5200,
    },
    // Week 2: Jan 9-15, 2023
    {
      date: '2023-01-09', // Monday
      median_house_price_syd: 110000,
      jobseeker_recipients: 11000,
      rba_cash_rate: 5.5,
      aud_usd_exchange: 5500,
    },
    {
      date: '2023-01-10', // Tuesday
      median_house_price_syd: 112000,
      jobseeker_recipients: 11100,
      rba_cash_rate: 5.6,
      aud_usd_exchange: 5600,
    },
  ];

  describe('processDaily', () => {
    it('should process daily data without aggregation', () => {
      const result = processDaily(mockData, 'median_house_price_syd');

      expect(result).toHaveLength(5);
      expect(result[0].value).toBe(100000);
      expect(result[0].date).toMatch(/02 Jan 2023/);
    });

    it('should format dates correctly', () => {
      const result = processDaily(mockData, 'median_house_price_syd');

      expect(result[0].date).toBe('02 Jan 2023');
      expect(result[1].date).toBe('03 Jan 2023');
    });

    it('should preserve original dates', () => {
      const result = processDaily(mockData, 'median_house_price_syd');

      expect(result[0].originalDate).toBe('2023-01-02');
    });

    it('should handle empty data', () => {
      const result = processDaily([], 'median_house_price_syd');
      expect(result).toEqual([]);
    });

    it('should extract correct metric', () => {
      const result = processDaily(mockData, 'jobseeker_recipients');

      expect(result[0].value).toBe(10000);
      expect(result[1].value).toBe(10100);
    });
  });

  describe('aggregateByWeek', () => {
    it('should group data by week', () => {
      const result = aggregateByWeek(mockData, 'median_house_price_syd');

      // Should have 2 weeks
      expect(result).toHaveLength(2);
    });

    it('should calculate average for each week', () => {
      const result = aggregateByWeek(mockData, 'median_house_price_syd');

      // Week 1: (100000 + 102000 + 104000) / 3 = 102000
      expect(result[0].value).toBeCloseTo(102000, 0);

      // Week 2: (110000 + 112000) / 2 = 111000
      expect(result[1].value).toBeCloseTo(111000, 0);
    });

    it('should format dates as "Week of DD MMM YYYY"', () => {
      const result = aggregateByWeek(mockData, 'median_house_price_syd');

      expect(result[0].date).toMatch(/Week of \d{2} Jan 2023/);
    });

    it('should handle single data point', () => {
      const singleItem = [mockData[0]];
      const result = aggregateByWeek(singleItem, 'median_house_price_syd');

      expect(result).toHaveLength(1);
      expect(result[0].value).toBe(100000);
    });

    it('should handle empty data', () => {
      const result = aggregateByWeek([], 'median_house_price_syd');
      expect(result).toEqual([]);
    });

    it('should sort results by date', () => {
      // Unsorted data
      const unsortedData = [mockData[3], mockData[0], mockData[1]];
      const result = aggregateByWeek(unsortedData, 'median_house_price_syd');

      // Should be sorted chronologically
      const dates = result.map(r => new Date(r.originalDate || r.date));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i - 1].getTime());
      }
    });

    it('should work with different metrics', () => {
      const result = aggregateByWeek(mockData, 'rba_cash_rate');

      // Week 1: (5.0 + 5.1 + 5.2) / 3 = 5.1
      expect(result[0].value).toBeCloseTo(5.1, 1);
    });
  });

  describe('aggregateByFortnight', () => {
    it('should group data into 14-day periods', () => {
      const result = aggregateByFortnight(mockData, 'median_house_price_syd');

      // All data falls within first 14 days
      expect(result).toHaveLength(1);
    });

    it('should calculate average for fortnight', () => {
      const result = aggregateByFortnight(mockData, 'median_house_price_syd');

      // Average of all 5 values
      const expectedAvg = (100000 + 102000 + 104000 + 110000 + 112000) / 5;
      expect(result[0].value).toBeCloseTo(expectedAvg, 0);
    });

    it('should format dates as range', () => {
      const result = aggregateByFortnight(mockData, 'median_house_price_syd');

      expect(result[0].date).toMatch(/\d{2} Jan - \d{2} Jan 2023/);
    });

    it('should handle data spanning multiple fortnights', () => {
      // Create data spanning 30 days
      const extendedData: RawDataPoint[] = [
        { ...mockData[0], date: '2023-01-01' },
        { ...mockData[1], date: '2023-01-15' }, // Day 15 - new fortnight
        { ...mockData[2], date: '2023-01-30' }, // Day 30 - another fortnight
      ];

      const result = aggregateByFortnight(extendedData, 'median_house_price_syd');

      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle empty data', () => {
      const result = aggregateByFortnight([], 'median_house_price_syd');
      expect(result).toEqual([]);
    });

    it('should preserve original start date', () => {
      const result = aggregateByFortnight(mockData, 'median_house_price_syd');

      expect(result[0].originalDate).toBe('2023-01-02');
    });
  });

  describe('aggregateByMonth', () => {
    it('should group data by calendar month', () => {
      const result = aggregateByMonth(mockData, 'median_house_price_syd');

      // All data in January
      expect(result).toHaveLength(1);
    });

    it('should calculate average for month', () => {
      const result = aggregateByMonth(mockData, 'median_house_price_syd');

      // Average of all 5 values
      const expectedAvg = (100000 + 102000 + 104000 + 110000 + 112000) / 5;
      expect(result[0].value).toBeCloseTo(expectedAvg, 0);
    });

    it('should format dates as "MMM YYYY"', () => {
      const result = aggregateByMonth(mockData, 'median_house_price_syd');

      expect(result[0].date).toBe('Jan 2023');
    });

    it('should handle data spanning multiple months', () => {
      const multiMonthData: RawDataPoint[] = [
        { ...mockData[0], date: '2023-01-15' },
        { ...mockData[1], date: '2023-02-15' },
        { ...mockData[2], date: '2023-03-15' },
      ];

      const result = aggregateByMonth(multiMonthData, 'median_house_price_syd');

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('Jan 2023');
      expect(result[1].date).toBe('Feb 2023');
      expect(result[2].date).toBe('Mar 2023');
    });

    it('should handle year boundaries', () => {
      const yearBoundaryData: RawDataPoint[] = [
        { ...mockData[0], date: '2022-12-15' },
        { ...mockData[1], date: '2023-01-15' },
      ];

      const result = aggregateByMonth(yearBoundaryData, 'median_house_price_syd');

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('Dec 2022');
      expect(result[1].date).toBe('Jan 2023');
    });

    it('should handle empty data', () => {
      const result = aggregateByMonth([], 'median_house_price_syd');
      expect(result).toEqual([]);
    });

    it('should sort results chronologically', () => {
      const unsortedData: RawDataPoint[] = [
        { ...mockData[0], date: '2023-03-15' },
        { ...mockData[1], date: '2023-01-15' },
        { ...mockData[2], date: '2023-02-15' },
      ];

      const result = aggregateByMonth(unsortedData, 'median_house_price_syd');

      expect(result[0].date).toBe('Jan 2023');
      expect(result[1].date).toBe('Feb 2023');
      expect(result[2].date).toBe('Mar 2023');
    });

    it('should work with different metrics', () => {
      const result = aggregateByMonth(mockData, 'jobseeker_recipients');

      const expectedAvg = (10000 + 10100 + 10200 + 11000 + 11100) / 5;
      expect(result[0].value).toBeCloseTo(expectedAvg, 0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single day data across all aggregations', () => {
      const singleDay = [mockData[0]];

      const daily = processDaily(singleDay, 'median_house_price_syd');
      const weekly = aggregateByWeek(singleDay, 'median_house_price_syd');
      const fortnightly = aggregateByFortnight(singleDay, 'median_house_price_syd');
      const monthly = aggregateByMonth(singleDay, 'median_house_price_syd');

      expect(daily).toHaveLength(1);
      expect(weekly).toHaveLength(1);
      expect(fortnightly).toHaveLength(1);
      expect(monthly).toHaveLength(1);

      expect(daily[0].value).toBe(100000);
      expect(weekly[0].value).toBe(100000);
      expect(fortnightly[0].value).toBe(100000);
      expect(monthly[0].value).toBe(100000);
    });

    it('should handle data with gaps', () => {
      const dataWithGaps: RawDataPoint[] = [
        { ...mockData[0], date: '2023-01-01' },
        { ...mockData[1], date: '2023-01-15' }, // 14 day gap
        { ...mockData[2], date: '2023-01-30' }, // Another 15 day gap
      ];

      const weekly = aggregateByWeek(dataWithGaps, 'median_house_price_syd');

      // Should have 3 different weeks
      expect(weekly.length).toBeGreaterThanOrEqual(3);
    });

    it('should maintain precision with decimal values', () => {
      const decimalData: RawDataPoint[] = [
        {
          date: '2023-01-01',
          median_house_price_syd: 120000.50,
          jobseeker_recipients: 10000,
          rba_cash_rate: 5.05,
          aud_usd_exchange: 5000,
        },
        {
          date: '2023-01-02',
          median_house_price_syd: 120000.75,
          jobseeker_recipients: 10000,
          rba_cash_rate: 5.15,
          aud_usd_exchange: 5000,
        },
      ];

      const weekly = aggregateByWeek(decimalData, 'rba_cash_rate');
      
      // (5.05 + 5.15) / 2 = 5.1
      expect(weekly[0].value).toBeCloseTo(5.1, 1);
    });
  });
});