/**
 * DataChart - Main container component
 * 
 * Orchestrates the entire chart visualization:
 * - Loads data from JSON
 * - Manages chart configuration state
 * - Coordinates child components
 */

import { useState, useEffect } from 'react';
import type { ChartConfig } from '@/types/chart.types';
import type { RawDataPoint } from '@/types/data.types';
import { DEFAULT_CHART_CONFIG, PRIMARY_METRIC } from '@/utils/constants';
import { useChartData } from '@/hooks/useChartData';
import { ChartControls } from './ChartControls';
import { ChartView } from './ChartView';
import { Github } from 'lucide-react';

interface DataChartProps {
  data?: RawDataPoint[];
}

export const DataChart: React.FC<DataChartProps> = ({ data: providedData }) => {
  const [config, setConfig] = useState<ChartConfig>(DEFAULT_CHART_CONFIG);
  const [rawData, setRawData] = useState<RawDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from JSON file
  useEffect(() => {
    // If data is provided via props (for testing), use it
    if (providedData) {
      setRawData(providedData);
      setLoading(false);
      return;
    }

    // Otherwise, load from public folder
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/assessment_2.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();
        
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          throw new Error('Invalid data format: expected non-empty array');
        }

        setRawData(jsonData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [providedData]);

  // Process data using custom hook
  const { processedData } = useChartData(rawData, config.timeGrouping);

  // Handle chart type change
  const handleChartTypeChange = (newType: ChartConfig['chartType']) => {
    setConfig(prev => ({ ...prev, chartType: newType }));
  };

  // Handle time grouping change
  const handleTimeGroupingChange = (newGrouping: ChartConfig['timeGrouping']) => {
    setConfig(prev => ({ ...prev, timeGrouping: newGrouping }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <header className="mb-4" data-testid="chart-header">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 {PRIMARY_METRIC.label}
          </h1>
          <p className="text-gray-600" data-testid="chart-description">
            {PRIMARY_METRIC.description}
          </p>
        </header>

        {/* Main Content */}
        <main data-testid="chart-main">
          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-lg p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading chart data...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Failed to Load Data
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Chart Content */}
          {!loading && !error && (
            <>
              {/* Controls */}
              <ChartControls
                timeGrouping={config.timeGrouping}
                onTimeGroupingChange={handleTimeGroupingChange}
                chartType={config.chartType}
                onChartTypeChange={handleChartTypeChange}
              />

              {/* Chart */}
              <ChartView
                chartType={config.chartType}
                data={processedData}
                metric={PRIMARY_METRIC}
              />

              {/* Stats */}
              <div className="mt-6 bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Chart Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {config.chartType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Grouping</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {config.timeGrouping}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data Points</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {processedData.length.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Records</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {rawData.length.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
        <footer className="mt-10 text-center text-gray-500 flex justify-center items-center gap-2">
          <Github data-testid="github-icon" className="w-5 h-5 inline" />
          <a
            href="https://github.com/RuxinMa/chart-visualisation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 hover:underline transition-colors"
          >
            GitHub Repository
          </a>
        </footer>
      </div>
    </div>
  );
};