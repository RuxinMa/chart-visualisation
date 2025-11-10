/**
 * Data transformation and validation utilities
 */

import type { RawDataPoint, ValidationResult } from '@/types/data.types';

/**
 * Validate raw data structure
 * @param data - Array of raw data points
 * @returns Validation result with errors if any
 */
export const validateData = (data: unknown[]): ValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    return { valid: false, errors: ['Data must be an array'] };
  }

  if (data.length === 0) {
    return { valid: false, errors: ['Data array is empty'] };
  }

  // Check first few items for structure
  const samplesToCheck = Math.min(5, data.length);
  
  for (let i = 0; i < samplesToCheck; i++) {
    const item = data[i] as Record<string, unknown>;

    if (!item || typeof item !== 'object') {
      errors.push(`Item at index ${i} is not an object`);
      continue;
    }

    // Check required fields
    if (!item.date || typeof item.date !== 'string') {
      errors.push(`Item at index ${i} missing or invalid 'date' field`);
    }

    if (typeof item.median_house_price_syd !== 'number') {
      errors.push(`Item at index ${i} missing or invalid 'median_house_price_syd' field`);
    }

    if (typeof item.jobseeker_recipients !== 'number') {
      errors.push(`Item at index ${i} missing or invalid 'jobseeker_recipients' field`);
    }

    if (typeof item.rba_cash_rate !== 'number') {
      errors.push(`Item at index ${i} missing or invalid 'rba_cash_rate' field`);
    }

    if (typeof item.aud_usd_exchange !== 'number') {
      errors.push(`Item at index ${i} missing or invalid 'aud_usd_exchange' field`);
    }

    // Validate date format (basic check)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const dateValue = item.date;
    if (typeof dateValue === 'string' && !dateRegex.test(dateValue)) {
      errors.push(`Item at index ${i} has invalid date format (expected YYYY-MM-DD)`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Clean data by handling null/undefined values
 * @param data - Raw data points
 * @returns Cleaned data points
 */
export const cleanData = (data: RawDataPoint[]): RawDataPoint[] => {
  return data.map(item => ({
    date: item.date || '',
    median_house_price_syd: item.median_house_price_syd ?? 0,
    jobseeker_recipients: item.jobseeker_recipients ?? 0,
    rba_cash_rate: item.rba_cash_rate ?? 0,
    aud_usd_exchange: item.aud_usd_exchange ?? 0,
  }));
};

/**
 * Sort data by date in ascending order
 * @param data - Raw data points
 * @returns Sorted data points
 */
export const sortByDate = (data: RawDataPoint[]): RawDataPoint[] => {
  return [...data].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

/**
 * Extract a specific metric from raw data
 * @param data - Raw data points
 * @param metricKey - Key of the metric to extract
 * @returns Array of values
 */
export const extractMetric = (
  data: RawDataPoint[],
  metricKey: keyof Omit<RawDataPoint, 'date'>
): number[] => {
  return data.map(item => item[metricKey]);
};

/**
 * Calculate average of an array of numbers
 * @param values - Array of numbers
 * @returns Average value
 */
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

/**
 * Remove duplicate dates (keep first occurrence)
 * @param data - Raw data points
 * @returns Data with unique dates
 */
export const removeDuplicateDates = (data: RawDataPoint[]): RawDataPoint[] => {
  const seen = new Set<string>();
  return data.filter(item => {
    if (seen.has(item.date)) {
      return false;
    }
    seen.add(item.date);
    return true;
  });
};