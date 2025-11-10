import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChartData } from './useChartData';
import type { RawDataPoint } from '@/types/data.types';
import * as dataTransform from '@/utils/dataTransform';

const mockData: RawDataPoint[] = [
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
  {
    date: '2023-01-03',
    median_house_price_syd: 119000,
    jobseeker_recipients: 9900,
    rba_cash_rate: 4.9,
    aud_usd_exchange: 4950,
  },
];

describe('useChartData', () => {
  describe('Basic functionality', () => {
    it('should process data without errors', () => {
      const { result } = renderHook(() => useChartData(mockData, 'daily'));

      expect(result.current.processedData).toHaveLength(3);
      expect(result.current.isProcessing).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle empty data', () => {
      const { result } = renderHook(() => useChartData([], 'daily'));

      expect(result.current.processedData).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Time grouping', () => {
    it('should support daily grouping', () => {
      const { result } = renderHook(() => useChartData(mockData, 'daily'));

      expect(result.current.processedData).toHaveLength(3);
      expect(result.current.processedData[0].date).toMatch(/Jan 2023/);
    });

    it('should support weekly grouping', () => {
      const { result } = renderHook(() => useChartData(mockData, 'weekly'));

      expect(result.current.processedData.length).toBeGreaterThan(0);
      expect(result.current.processedData[0].date).toMatch(/Week of/);
    });

    it('should support monthly grouping', () => {
      const { result } = renderHook(() => useChartData(mockData, 'monthly'));

      expect(result.current.processedData).toHaveLength(1);
      expect(result.current.processedData[0].date).toBe('Jan 2023');
    });
  });

  describe('Data processing', () => {
    it('should extract values correctly', () => {
      const { result } = renderHook(() => useChartData(mockData, 'daily'));

      result.current.processedData.forEach(point => {
        expect(point.value).toBeGreaterThan(0);
        expect(typeof point.value).toBe('number');
      });
    });

    it('should update when data changes', () => {
      const { result, rerender } = renderHook(
        ({ data, grouping }) => useChartData(data, grouping),
        { initialProps: { data: mockData, grouping: 'daily' as const } }
      );

      const firstResult = result.current.processedData;

      const newData = [...mockData, {
        date: '2023-01-04',
        median_house_price_syd: 122000,
        jobseeker_recipients: 10200,
        rba_cash_rate: 5.2,
        aud_usd_exchange: 5100,
      }];

      rerender({ data: newData, grouping: 'daily' });

      expect(result.current.processedData).not.toBe(firstResult);
      expect(result.current.processedData).toHaveLength(4);
    });
  });
});

describe('Edge cases', () => {
  it('should handle invalid data structure', () => {
    const invalidData = [
      { wrongField: 123 } 
    ] as unknown as RawDataPoint[];

    const { result } = renderHook(() => useChartData(invalidData, 'daily'));

    expect(result.current.processedData).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fallback to daily for unknown time grouping', () => {
    const { result } = renderHook(() => useChartData(mockData, 'yearly' as any));

    expect(result.current.processedData).toHaveLength(3); 
    expect(result.current.error).toBeNull();
  });

  it('should catch unexpected errors gracefully', () => {
    // Use a spy to simulate an error in data processing
    const spy = vi.spyOn(dataTransform, 'cleanData').mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const { result } = renderHook(() => useChartData(mockData, 'daily'));
    expect(result.current.processedData).toEqual([]);
    expect(result.current.error).toBeNull();

    spy.mockRestore();
  });
});