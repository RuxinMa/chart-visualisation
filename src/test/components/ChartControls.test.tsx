import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChartControls } from '../../components/ChartControls';

describe('ChartControls', () => {
  const mockTimeGroupingChange = vi.fn();
  const mockChartTypeChange = vi.fn();

  const defaultProps = {
    timeGrouping: 'daily' as const,
    onTimeGroupingChange: mockTimeGroupingChange,
    chartType: 'line' as const,
    onChartTypeChange: mockChartTypeChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<ChartControls {...defaultProps} />);
      expect(screen.getByTestId('chart-controls')).toBeInTheDocument();
    });

    it('should render all time grouping options', () => {
      render(<ChartControls {...defaultProps} />);
      
      expect(screen.getByText('Daily')).toBeInTheDocument();
      expect(screen.getByText('Weekly')).toBeInTheDocument();
      expect(screen.getByText('Fortnightly')).toBeInTheDocument();
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    it('should render all chart type options', () => {
      render(<ChartControls {...defaultProps} />);
      
      expect(screen.getByText('Line Chart')).toBeInTheDocument();
      expect(screen.getByText('Bar Chart')).toBeInTheDocument();
      expect(screen.getByText('Scatter Plot')).toBeInTheDocument();
    });

    it('should have proper section labels', () => {
      render(<ChartControls {...defaultProps} />);
      
      expect(screen.getByText('Time Grouping')).toBeInTheDocument();
      expect(screen.getByText('Chart Type')).toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    it('should highlight active time grouping', () => {
      render(<ChartControls {...defaultProps} />);
      
      const dailyButton = screen.getByTestId('time-grouping-daily');
      expect(dailyButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should highlight active chart type', () => {
      render(<ChartControls {...defaultProps} />);
      
      const lineButton = screen.getByTestId('chart-type-line');
      expect(lineButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should not highlight inactive options', () => {
      render(<ChartControls {...defaultProps} />);
      
      const weeklyButton = screen.getByTestId('time-grouping-weekly');
      expect(weeklyButton).toHaveClass('bg-gray-200', 'text-gray-700');
      
      const barButton = screen.getByTestId('chart-type-bar');
      expect(barButton).toHaveClass('bg-gray-200', 'text-gray-700');
    });

    it('should update active state when props change', () => {
      const { rerender } = render(<ChartControls {...defaultProps} />);
      
      // Initially daily is active
      expect(screen.getByTestId('time-grouping-daily')).toHaveClass('bg-blue-600');
      
      // Change to weekly
      rerender(<ChartControls {...defaultProps} timeGrouping="weekly" />);
      
      expect(screen.getByTestId('time-grouping-weekly')).toHaveClass('bg-blue-600');
      expect(screen.getByTestId('time-grouping-daily')).toHaveClass('bg-gray-200');
    });
  });

  describe('User Interactions', () => {
    it('should call onTimeGroupingChange when clicking time grouping button', async () => {
      const user = userEvent.setup();
      render(<ChartControls {...defaultProps} />);
      
      const weeklyButton = screen.getByTestId('time-grouping-weekly');
      await user.click(weeklyButton);
      
      expect(mockTimeGroupingChange).toHaveBeenCalledWith('weekly');
      expect(mockTimeGroupingChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChartTypeChange when clicking chart type button', async () => {
      const user = userEvent.setup();
      render(<ChartControls {...defaultProps} />);
      
      const barButton = screen.getByTestId('chart-type-bar');
      await user.click(barButton);
      
      expect(mockChartTypeChange).toHaveBeenCalledWith('bar');
      expect(mockChartTypeChange).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple interactions', async () => {
      const user = userEvent.setup();
      render(<ChartControls {...defaultProps} />);
      
      // Change time grouping
      await user.click(screen.getByTestId('time-grouping-monthly'));
      expect(mockTimeGroupingChange).toHaveBeenCalledWith('monthly');
      
      // Change chart type
      await user.click(screen.getByTestId('chart-type-scatter'));
      expect(mockChartTypeChange).toHaveBeenCalledWith('scatter');
      
      expect(mockTimeGroupingChange).toHaveBeenCalledTimes(1);
      expect(mockChartTypeChange).toHaveBeenCalledTimes(1);
    });

    it('should allow clicking already active option', async () => {
      const user = userEvent.setup();
      render(<ChartControls {...defaultProps} />);
      
      // Click already active option
      await user.click(screen.getByTestId('time-grouping-daily'));
      
      expect(mockTimeGroupingChange).toHaveBeenCalledWith('daily');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ChartControls {...defaultProps} />);
      
      expect(screen.getByLabelText('Time Grouping')).toBeInTheDocument();
      expect(screen.getByLabelText('Chart Type')).toBeInTheDocument();
    });

    it('should have role="group" for button groups', () => {
      const { container } = render(<ChartControls {...defaultProps} />);
      
      const groups = container.querySelectorAll('[role="group"]');
      expect(groups).toHaveLength(2);
    });

    it('should have aria-pressed attribute on buttons', () => {
      render(<ChartControls {...defaultProps} />);
      
      const dailyButton = screen.getByTestId('time-grouping-daily');
      expect(dailyButton).toHaveAttribute('aria-pressed', 'true');
      
      const weeklyButton = screen.getByTestId('time-grouping-weekly');
      expect(weeklyButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<ChartControls {...defaultProps} />);
      
      const dailyButton = screen.getByTestId('time-grouping-daily');
      
      // Tab to button
      await user.tab();
      expect(dailyButton).toHaveFocus();
      
      // Press Enter
      await user.keyboard('{Enter}');
      expect(mockTimeGroupingChange).toHaveBeenCalled();
    });

    it('should have focus styles', () => {
      render(<ChartControls {...defaultProps} />);
      
      const dailyButton = screen.getByTestId('time-grouping-daily');
      expect(dailyButton).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });
  });

  describe('Responsive Design', () => {
    it('should use flexbox with wrap for responsive layout', () => {
      const { container } = render(<ChartControls {...defaultProps} />);
      
      const buttonGroups = container.querySelectorAll('.flex.flex-wrap');
      expect(buttonGroups.length).toBeGreaterThan(0);
    });

    it('should have proper spacing between buttons', () => {
      const { container } = render(<ChartControls {...defaultProps} />);
      
      const buttonGroups = container.querySelectorAll('.gap-2');
      expect(buttonGroups.length).toBeGreaterThan(0);
    });
  });

  describe('Styling', () => {
    it('should have consistent button styling', () => {
      render(<ChartControls {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('px-4', 'py-2', 'rounded-lg');
      });
    });

    it('should have transition effects', () => {
      render(<ChartControls {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-colors', 'duration-200');
      });
    });

    it('should have hover styles on inactive buttons', () => {
      render(<ChartControls {...defaultProps} />);
      
      const weeklyButton = screen.getByTestId('time-grouping-weekly');
      expect(weeklyButton).toHaveClass('hover:bg-gray-300');
    });
  });
});