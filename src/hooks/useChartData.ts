/**
 * Custom hook for processing chart data
 * 
 * Handles data aggregation based on time grouping
 * and metric extraction
 */

import { useMemo } from 'react';
import type { RawDataPoint, ProcessedDataPoint } from '@/types/data.types';
import type { TimeGrouping } from '@/types/chart.types';
import {
  processDaily,
  aggregateByWeek,
  aggregateByFortnight,
  aggregateByMonth,
} from '@/utils/aggregations';
import {
  validateData,
  cleanData,
  sortByDate,
  removeDuplicateDates,
} from '@/utils/dataTransform';
import { PRIMARY_METRIC } from '@/utils/constants';

interface UseChartDataResult {
  processedData: ProcessedDataPoint[];
  isProcessing: boolean;
  error: Error | null;
}

/**
 * Process raw data based on time grouping
 * 
 * @param rawData - Raw data points from JSON
 * @param timeGrouping - Time aggregation level
 * @returns Processed data ready for charting
 */
export const useChartData = (
  rawData: RawDataPoint[],
  timeGrouping: TimeGrouping
): UseChartDataResult => {
  const processedData = useMemo(() => {
    try {
      // Handle empty data
      if (!rawData || rawData.length === 0) {
        return [];
      }

      // Validate data structure
      const validation = validateData(rawData);
      if (!validation.valid) {
        console.error('Data validation failed:', validation.errors);
        return [];
      }

      // Clean data (handle nulls)
      const cleaned = cleanData(rawData);

      // Remove duplicates
      const unique = removeDuplicateDates(cleaned);

      // Sort by date
      const sorted = sortByDate(unique);

      // Get metric key
      const metricKey = PRIMARY_METRIC.key;

      // Aggregate based on time grouping
      switch (timeGrouping) {
        case 'daily':
          return processDaily(sorted, metricKey);
        
        case 'weekly':
          return aggregateByWeek(sorted, metricKey);
        
        case 'fortnightly':
          return aggregateByFortnight(sorted, metricKey);
        
        case 'monthly':
          return aggregateByMonth(sorted, metricKey);
        
        default:
          console.warn(`Unknown time grouping: ${timeGrouping}`);
          return processDaily(sorted, metricKey);
      }
    } catch (error) {
      console.error('Error processing chart data:', error);
      return [];
    }
  }, [rawData, timeGrouping]);

  return {
    processedData,
    isProcessing: false,
    error: null,
  };
};