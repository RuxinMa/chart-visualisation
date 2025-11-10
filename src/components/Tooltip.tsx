import { PRIMARY_METRIC } from '@/utils/constants';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  metric: typeof PRIMARY_METRIC;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  metric,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0];
  const value = data.value;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-900 mb-2">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: metric.color }}
        />
        <p className="text-sm text-gray-600">
          {metric.label}
        </p>
      </div>
      <p className="text-lg font-bold text-gray-900 mt-1">
        {metric.formatValue(value)}
      </p>
    </div>
  );
};