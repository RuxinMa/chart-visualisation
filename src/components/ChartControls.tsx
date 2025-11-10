import type { ChartControlsProps } from '@/types/chart.types';
import { CHART_TYPES, TIME_GROUPINGS } from '@/utils/constants';
import React from 'react';

const OptionGroup = <T extends string>({
  label,
  options,
  selectedValue,
  onChange,
  testPrefix,
}: {
  label: string;
  options: { label: string; value: T }[];
  selectedValue: T;
  onChange: (value: T) => void;
  testPrefix: string;
}) => (
  <div>
    <label
      className="block font-medium text-gray-700 mb-3"
      id={`${testPrefix}-label`}
    >
      {label}
    </label>
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-labelledby={`${testPrefix}-label`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${
              selectedValue === option.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
          aria-pressed={selectedValue === option.value}
          data-testid={`${testPrefix}-${option.value}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

/**
 * ChartControls - Combined control panel
 * 
 * Responsive layout:
 * - Desktop (≥768px): Time grouping and chart type in one row
 * - Mobile (<768px): Stacked vertically
 */
export const ChartControls: React.FC<ChartControlsProps> = ({
  timeGrouping,
  onTimeGroupingChange,
  chartType,
  onChartTypeChange,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow p-6 mb-6"
      data-testid="chart-controls"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OptionGroup
          label="Time Grouping"
          options={TIME_GROUPINGS}
          selectedValue={timeGrouping}
          onChange={onTimeGroupingChange}
          testPrefix="time-grouping"
        />

        <OptionGroup
          label="Chart Type"
          options={CHART_TYPES}
          selectedValue={chartType}
          onChange={onChartTypeChange}
          testPrefix="chart-type"
        />
      </div>
    </div>
  );
};
