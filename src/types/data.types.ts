/**
 * Data type definitions
 */
export interface RawDataPoint {
  date: string;                      // ISO format: "YYYY-MM-DD"
  median_house_price_syd: number;    // Sydney median house price
  jobseeker_recipients: number;       // Number of jobseeker recipients
  rba_cash_rate: number;             // RBA cash rate (percentage)
  aud_usd_exchange: number;          // AUD/USD exchange rate
}

/**
 * Processed data point after aggregation and formatting
 */
export interface ProcessedDataPoint {
  date: string;                      // Formatted date string
  value: number;                     // Metric value
  originalDate?: string;             // Original ISO date (for reference)
}

/**
 * Metric configuration
 */
export interface MetricConfig {
  key: keyof Omit<RawDataPoint, 'date'>;
  label: string;
  description: string;
  formatValue: (value: number) => string;
  color: string;
  yAxis?: {
    paddingPercent?: number;
    min?: number;
    max?: number;
    tickCount?: number;
  };
}

/**
 * Data validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Available metric keys for type safety
 */
export type MetricKey = 'house_price' | 'jobseekers' | 'cash_rate' | 'exchange_rate';