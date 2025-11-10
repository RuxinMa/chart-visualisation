/**
 * Application constants and metric configurations
 */

import { ACTIVE_METRIC } from '@/config';
import type { MetricConfig, MetricKey } from '@/types/data.types';
import type { 
  ChartType, 
  TimeGrouping, 
  ChartTypeOption, 
  TimeGroupingOption 
} from '@/types/chart.types';

/**
 * All available metrics configuration
 */
export const ALL_METRICS: Record<MetricKey, MetricConfig> = {
  house_price: {
    key: 'median_house_price_syd',
    label: 'Median House Price (Sydney)',
    color: '#3B82F6',
    formatValue: (value: number) => `$${(value / 1000).toFixed(0)}K`,
    description: 'Sydney median property prices over time',
    yAxis: {
      paddingPercent: 10,
    },
  },
  jobseekers: {
    key: 'jobseeker_recipients',
    label: 'Jobseeker Recipients',
    color: '#EF4444',
    formatValue: (value: number) => value.toLocaleString('en-AU', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }),
    description: 'Number of people receiving jobseeker benefits',
    yAxis: {
      paddingPercent: 15,
    },
  },
  cash_rate: {
    key: 'rba_cash_rate',
    label: 'RBA Cash Rate',
    color: '#10B981',
    formatValue: (value: number) => `${value.toFixed(2)}%`,
    description: 'Reserve Bank of Australia official cash rate',
    yAxis: {
      paddingPercent: 5,
      tickCount: 8,
    },
  },
  exchange_rate: {
    key: 'aud_usd_exchange',
    label: 'AUD/USD Exchange Rate',
    color: '#F59E0B',
    formatValue: (value: number) => `$${(value / 10000).toFixed(4)}`,
    description: 'Australian Dollar to US Dollar exchange rate',
    yAxis: {
      paddingPercent: 8,
    },
  },
};

/**
 * Primary metric - determined by ACTIVE_METRIC in config
 */
export const PRIMARY_METRIC = ALL_METRICS[ACTIVE_METRIC];

// Validate configuration at module load time
if (!PRIMARY_METRIC) {
  throw new Error(
    `Invalid ACTIVE_METRIC: "${ACTIVE_METRIC}". ` +
    `Must be one of: ${Object.keys(ALL_METRICS).join(', ')}`
  );
}

/**
 * Chart type options
 */
export const CHART_TYPES: ChartTypeOption[] = [
  { value: 'line', label: 'Line Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
];

/**
 * Time grouping options
 */
export const TIME_GROUPINGS: TimeGroupingOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
];

/**
 * Default chart configuration
 */
export const DEFAULT_CHART_CONFIG = {
  chartType: 'line' as ChartType,
  timeGrouping: 'daily' as TimeGrouping,
};