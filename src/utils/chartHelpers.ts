/**
 * Chart helper utilities
 * Calculate Y-axis domain, formatting, etc.
 */

import type { ProcessedDataPoint } from '@/types/data.types';
import type { MetricConfig } from '@/types/data.types';

/**
 * Calculate Y-axis domain (min/max) for better visualization
 * 
 * @param data - Processed data points
 * @param metric - Metric configuration
 * @returns [min, max] domain for Y-axis
 */
export const calculateYAxisDomain = (
  data: ProcessedDataPoint[],
  metric: MetricConfig
): [number, number] => {
  if (data.length === 0) {
    return [0, 100];
  }

  // Check if fixed range is provided
  if (metric.yAxis?.min !== undefined && metric.yAxis?.max !== undefined) {
    return [metric.yAxis.min, metric.yAxis.max];
  }

  // Calculate data range
  const values = data.map(d => d.value);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const dataRange = dataMax - dataMin;

  // Apply padding percentage (default 10%)
  const paddingPercent = metric.yAxis?.paddingPercent || 10;
  const padding = (dataRange * paddingPercent) / 100;

  const min = dataMin - padding;
  const max = dataMax + padding;

  // Smart rounding based on value magnitude
  const roundedMin = roundToNiceNumber(min, 'floor');
  const roundedMax = roundToNiceNumber(max, 'ceil');

  return [roundedMin, roundedMax];
};

/**
 * Round number to "nice" values based on magnitude
 * 
 * @param value - Number to round
 * @param direction - Round up or down
 * @returns Rounded number
 */
const roundToNiceNumber = (
  value: number, 
  direction: 'floor' | 'ceil'
): number => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? -1 : 1;
  
  const roundFn = direction === 'floor' ? Math.floor : Math.ceil;
  
  // For very small values (< 1) - round to 2 decimals
  if (absValue < 1) {
    return sign * (roundFn(absValue * 100) / 100);
  }
  
  // For small values (1-10) - round to 1 decimal
  if (absValue < 10) {
    return sign * (roundFn(absValue * 10) / 10);
  }
  
  // For medium values (10-100) - round to integers
  if (absValue < 100) {
    return sign * roundFn(absValue);
  }
  
  // For large values (100-1000) - round to nearest 10
  if (absValue < 1000) {
    return sign * (roundFn(absValue / 10) * 10);
  }
  
  // For very large values (1000+) - round to nearest 1000
  return sign * (roundFn(absValue / 1000) * 1000);
};

/**
 * Format Y-axis tick values
 * 
 * @param value - Tick value
 * @param metric - Metric configuration
 * @returns Formatted string
 */
export const formatYAxisTick = (
  value: number,
  metric: MetricConfig
): string => {
  return metric.formatValue(value);
};

/**
 * Calculate appropriate tick count based on range
 * 
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Number of ticks
 */
export const calculateTickCount = (min: number, max: number): number => {
  const range = max - min;
  
  // For very small ranges (< 1)
  if (range < 1) return 6;
  
  // For small ranges (1-10)
  if (range < 10) return 8;
  
  // For medium ranges (10-100)
  if (range < 100) return 7;
  
  // For large ranges (100-1000)
  if (range < 1000) return 6;
  
  // For very large ranges
  if (range < 5000) return 5;
  if (range < 10000) return 6;
  
  return 8;
};