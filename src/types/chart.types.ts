/**
 * Chart type definitions
 */

import type { ProcessedDataPoint, MetricConfig } from './data.types';

/**
 * Available chart types
 */
export type ChartType = 'line' | 'bar' | 'scatter';

/**
 * Time grouping options
 */
export const TimeGrouping = {
  Daily: 'daily',
  Weekly: 'weekly',
  Fortnightly: 'fortnightly',
  Monthly: 'monthly',
} as const;

export type TimeGrouping = (typeof TimeGrouping)[keyof typeof TimeGrouping];

/**
 * Chart configuration state
 */
export interface ChartConfig {
  chartType: ChartType;
  timeGrouping: TimeGrouping;
}

/**
 * Chart dimensions for responsive sizing
 */
export interface ChartDimensions {
  width: number;
  height: number;
}

/**
 * Props for DataChart component
 */
export interface DataChartProps {
  data?: ProcessedDataPoint[];       // Optional: for testing
  initialConfig?: Partial<ChartConfig>;
}

/**
 * Props for ChartControls component
 */
export interface ChartControlsProps {
  timeGrouping: TimeGrouping;
  onTimeGroupingChange: (value: TimeGrouping) => void;
  chartType: ChartType;
  onChartTypeChange: (value: ChartType) => void;
}

/**
 * Props for ChartView component
 */
export interface ChartViewProps {
  chartType: ChartType;
  data: ProcessedDataPoint[];
  metric: MetricConfig;
  dimensions?: ChartDimensions;
}

/**
 * Chart type option for UI rendering
 */
export interface ChartTypeOption {
  value: ChartType;
  label: string;
  icon?: string;
}

/**
 * Time grouping option for UI rendering
 */
export interface TimeGroupingOption {
  value: TimeGrouping;
  label: string;
}