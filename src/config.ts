/**
 * Application Configuration
 * 
 * To test different metrics, change ACTIVE_METRIC value below
 */

import type { MetricKey } from './types/data.types';

/**
 * Active metric to display in the chart
 * 
 * Options:
 * - 'house_price': Median House Price (Sydney) - ~$100k-$130k
 * - 'jobseekers': Jobseeker Recipients - ~9k-11k people
 * - 'cash_rate': RBA Cash Rate - ~4%-6%
 * - 'exchange_rate': AUD/USD Exchange Rate - ~0.48-0.52 USD
 * 
 * @default 'house_price'
 */
export const ACTIVE_METRIC: MetricKey = 'house_price';

/**
 * Chart dimensions configuration
 */
export const CHART_CONFIG = {
  defaultWidth: 1000,
  defaultHeight: 500,
  minHeight: 300,
  aspectRatio: 2, // width / height
} as const;

/**
 * Data aggregation settings
 */
export const AGGREGATION_CONFIG = {
  weekStartsOn: 1 as const, // Monday = 1, Sunday = 0
  fortnightDays: 14,
} as const;

/**
 * Animation settings
 */
export const ANIMATION_CONFIG = {
  duration: 500, // ms
  easing: 'ease-in-out' as const,
} as const;