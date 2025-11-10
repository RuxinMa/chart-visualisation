import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartView } from '@/components/ChartView';
import { PRIMARY_METRIC } from '@/utils/constants';
import type { ProcessedDataPoint } from '@/types/data.types';

describe('ChartView', () => {
  const mockData: ProcessedDataPoint[] = [
    { date: '01 Jan 2023', value: 120000, originalDate: '2023-01-01' },
    { date: '02 Jan 2023', value: 121000, originalDate: '2023-01-02' },
    { date: '03 Jan 2023', value: 119000, originalDate: '2023-01-03' },
  ];

  const defaultProps = {
    chartType: 'line' as const,
    data: mockData,
    metric: PRIMARY_METRIC,
  };

  describe('Basic Rendering', () => {
    it('should render chart container', () => {
      render(<ChartView {...defaultProps} />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();
    });

    it('should render with different chart types', () => {
      const { rerender } = render(<ChartView {...defaultProps} chartType="line" />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();

      rerender(<ChartView {...defaultProps} chartType="bar" />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();

      rerender(<ChartView {...defaultProps} chartType="scatter" />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no data', () => {
      render(<ChartView {...defaultProps} data={[]} />);
      expect(screen.getByTestId('chart-empty')).toBeInTheDocument();
      expect(screen.getByText('No data available to display')).toBeInTheDocument();
    });

    it('should show empty state when data is undefined', () => {
      render(<ChartView {...defaultProps} data={undefined as unknown as ProcessedDataPoint[]} />);
      expect(screen.getByTestId('chart-empty')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('should render with valid data', () => {
      render(<ChartView {...defaultProps} />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();
    });

    it('should update when data changes', () => {
      const { rerender } = render(<ChartView {...defaultProps} />);
      
      const newData = [
        { date: '04 Jan 2023', value: 122000, originalDate: '2023-01-04' },
      ];

      rerender(<ChartView {...defaultProps} data={newData} />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should accept custom dimensions', () => {
      render(<ChartView {...defaultProps} dimensions={{ width: 800, height: 400 }} />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();
    });

    it('should use custom metric config', () => {
      const customMetric = {
        ...PRIMARY_METRIC,
        label: 'Custom Label',
      };

      render(<ChartView {...defaultProps} metric={customMetric} />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();
    });
  });
});