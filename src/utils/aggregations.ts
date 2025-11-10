/**
 * Time-based data aggregation utilities
 * 
 * Aggregates daily data into weekly, fortnightly, and monthly groups
 * using average calculation for the specified metric.
 */

import { 
  parseISO, 
  addDays,
} from 'date-fns';
import { AGGREGATION_CONFIG } from '@/config';
import type { RawDataPoint, ProcessedDataPoint } from '@/types/data.types';
import { 
  formatDailyDate, 
  formatWeeklyDate, 
  formatFortnightlyDate,
  formatMonthlyDate,
  getWeekStart,
  getMonthStart,
} from './dateFormatters';
import { calculateAverage } from './dataTransform';

/**
 * Aggregate data by week (Monday to Sunday)
 * Calculates average value for each week
 * 
 * @param data - Raw data points
 * @param metricKey - Metric to aggregate
 * @returns Aggregated data points
 */
export const aggregateByWeek = (
  data: RawDataPoint[],
  metricKey: keyof Omit<RawDataPoint, 'date'>
): ProcessedDataPoint[] => {
  if (data.length === 0) return [];

  // Group data by week
  const weekGroups = new Map<string, RawDataPoint[]>();

  data.forEach(item => {
    const weekStartDate = getWeekStart(item.date);
    
    if (!weekGroups.has(weekStartDate)) {
      weekGroups.set(weekStartDate, []);
    }
    weekGroups.get(weekStartDate)!.push(item);
  });

  // Calculate average for each week
  const result: ProcessedDataPoint[] = [];

  weekGroups.forEach((items, weekStart) => {
    const values = items.map(item => item[metricKey]);
    const average = calculateAverage(values);

    result.push({
      date: formatWeeklyDate(weekStart),
      value: average,
      originalDate: weekStart,
    });
  });

  // Sort by date
  return result.sort((a, b) => {
    return new Date(a.originalDate || a.date).getTime() - 
           new Date(b.originalDate || b.date).getTime();
  });
};

/**
 * Aggregate data by fortnight (14 days)
 * Calculates average value for each fortnight period
 * 
 * @param data - Raw data points
 * @param metricKey - Metric to aggregate
 * @returns Aggregated data points
 */
export const aggregateByFortnight = (
  data: RawDataPoint[],
  metricKey: keyof Omit<RawDataPoint, 'date'>
): ProcessedDataPoint[] => {
  if (data.length === 0) return [];

  // Sort data by date first
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const result: ProcessedDataPoint[] = [];
  let currentFortnightStart = sortedData[0].date;
  let currentFortnightData: RawDataPoint[] = [];

  sortedData.forEach((item) => {
    const itemDate = parseISO(item.date);
    const fortnightStartDate = parseISO(currentFortnightStart);
    const fortnightEndDate = addDays(fortnightStartDate, AGGREGATION_CONFIG.fortnightDays - 1);

    // Check if item belongs to current fortnight
    if (itemDate <= fortnightEndDate) {
      currentFortnightData.push(item);
    } else {
      // Process completed fortnight
      if (currentFortnightData.length > 0) {
        const values = currentFortnightData.map(d => d[metricKey]);
        const average = calculateAverage(values);

        result.push({
          date: formatFortnightlyDate(currentFortnightStart),
          value: average,
          originalDate: currentFortnightStart,
        });
      }

      // Start new fortnight
      currentFortnightStart = item.date;
      currentFortnightData = [item];
    }
  });

  // Process last fortnight
  if (currentFortnightData.length > 0) {
    const values = currentFortnightData.map(d => d[metricKey]);
    const average = calculateAverage(values);

    result.push({
      date: formatFortnightlyDate(currentFortnightStart),
      value: average,
      originalDate: currentFortnightStart,
    });
  }

  return result;
};

/**
 * Aggregate data by month (calendar month)
 * Calculates average value for each month
 * 
 * @param data - Raw data points
 * @param metricKey - Metric to aggregate
 * @returns Aggregated data points
 */
export const aggregateByMonth = (
  data: RawDataPoint[],
  metricKey: keyof Omit<RawDataPoint, 'date'>
): ProcessedDataPoint[] => {
  if (data.length === 0) return [];

  // Group data by month
  const monthGroups = new Map<string, RawDataPoint[]>();

  data.forEach(item => {
    const monthStartDate = getMonthStart(item.date);
    
    if (!monthGroups.has(monthStartDate)) {
      monthGroups.set(monthStartDate, []);
    }
    monthGroups.get(monthStartDate)!.push(item);
  });

  // Calculate average for each month
  const result: ProcessedDataPoint[] = [];

  monthGroups.forEach((items, monthStart) => {
    const values = items.map(item => item[metricKey]);
    const average = calculateAverage(values);

    result.push({
      date: formatMonthlyDate(monthStart),
      value: average,
      originalDate: monthStart,
    });
  });

  // Sort by date
  return result.sort((a, b) => {
    return new Date(a.originalDate || a.date).getTime() - 
           new Date(b.originalDate || b.date).getTime();
  });
};

/**
 * Process daily data without aggregation
 * Just formats dates and extracts the metric
 * 
 * @param data - Raw data points
 * @param metricKey - Metric to extract
 * @returns Processed data points
 */
export const processDaily = (
  data: RawDataPoint[],
  metricKey: keyof Omit<RawDataPoint, 'date'>
): ProcessedDataPoint[] => {
  return data.map(item => ({
    date: formatDailyDate(item.date),
    value: item[metricKey],
    originalDate: item.date,
  }));
};