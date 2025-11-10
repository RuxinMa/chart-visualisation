import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import type { ChartViewProps } from '@/types/chart.types';
import { PRIMARY_METRIC } from '@/utils/constants';
import { calculateYAxisDomain, calculateTickCount } from '@/utils/chartHelpers';
import { CustomTooltip } from './Tooltip';

export const ChartView: React.FC<ChartViewProps> = ({
  chartType,
  data,
  metric = PRIMARY_METRIC,
  dimensions,
}) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center h-96 text-gray-500"
        data-testid="chart-empty"
      >
        <p>No data available to display</p>
      </div>
    );
  }

  // Calculate Y-axis domain
  const [yMin, yMax] = calculateYAxisDomain(data, metric);
  const tickCount = metric.yAxis?.tickCount || calculateTickCount(yMin, yMax);

  // Common chart props
  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  // Common axis props
  const xAxisProps = {
    dataKey: 'date',
    tick: { fontSize: 12, fill: '#6B7280' },
    tickLine: { stroke: '#E5E7EB' },
  };

  const yAxisProps = {
    domain: [yMin, yMax],
    tickCount: tickCount,
    tick: { fontSize: 12, fill: '#6B7280' },
    tickLine: { stroke: '#E5E7EB' },
    tickFormatter: (value: number) => metric.formatValue(value),
  };

  // Legend configuration - positioned at top
  const legendProps = {
    verticalAlign: 'top' as const,
    height: 36,
    iconType: 'line' as const,
    wrapperStyle: {
      paddingBottom: '10px',
    },
  };

  // Render appropriate chart type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip
              content={<CustomTooltip metric={metric} />}
              cursor={{ stroke: '#94A3B8', strokeWidth: 1 }}
            />
            <Legend {...legendProps} />
            <Line
              type="monotone"
              dataKey="value"
              name={metric.label}
              stroke={metric.color}
              strokeWidth={2}
              dot={{ r: 3, fill: metric.color }}
              activeDot={{ r: 6, fill: metric.color }}
              animationDuration={500}
            />
            <Brush
              dataKey="date"
              height={30}
              stroke={metric.color}
              fill="#F3F4F6"
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip
              content={<CustomTooltip metric={metric} />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Legend {...legendProps} />
            <Bar
              dataKey="value"
              name={metric.label}
              fill={metric.color}
              radius={[4, 4, 0, 0]}
              animationDuration={500}
            />
            <Brush
              dataKey="date"
              height={30}
              stroke={metric.color}
              fill="#F3F4F6"
            />
          </BarChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip
              content={<CustomTooltip metric={metric} />}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Legend {...legendProps} />
            <Scatter
              name={metric.label}
              dataKey="value"
              fill={metric.color}
              animationDuration={500}
            />
            <Brush
              dataKey="date"
              height={30}
              stroke={metric.color}
              fill="#F3F4F6"
            />
          </ScatterChart>
        );

      default:
        return <div>Unknown chart type</div>;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-6"
      data-testid="chart-view"
    >
      <ResponsiveContainer 
        width="100%" 
        height={dimensions?.height || 500}
      >
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};