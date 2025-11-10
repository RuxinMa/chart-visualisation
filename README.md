# Chart Visualization Assessment

Interactive data visualization app built with **React, TypeScript, Tailwind CSS**, and **Recharts** using data from *assessment_2.json*. Supports multiple aggregation levels and chart types.

## 🌐 Live Demo

[Deploy on Vercel]()

---

## 🛠️ Tech Stack

* **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**
* **Recharts** for visualization, **date-fns** for date manipulation
* **Vitest** + **React Testing Library** for testing
* **ESLint** and TypeScript strict mode for code quality


## 🎯 Features Implemented

### ✅ Task 2a: Basic Line Chart
- Interactive line chart with Recharts
- Hover tooltips showing data values
- Date formatting (DD MMM YYYY)
- Grid lines and axis labels
- Legend for data series
- Brush component for time range selection

### ✅ Task 2b: Time Aggregation
- **Daily**: Show individual data points
- **Weekly**: Aggregate by week (Monday-Sunday), display average
- **Fortnightly**: Aggregate by 14-day periods, display average
- **Monthly**: Aggregate by calendar month, display average
- Dynamic date formatting based on aggregation level

### ✅ Task 2c: Chart Type Switching
- **Line Chart**: Default visualization
- **Bar Chart**: Alternative bar visualization
- **Scatter Plot**: Scatter point visualization
- Smooth transitions between chart types

### 🌟 Bonus Features
- **Dynamic Y-axis Range**: Automatically adjusts to data range for better visibility
- **Responsive Design**: Optimized for desktop and mobile devices
- **Data Statistics**: Display total records and processed data points
- **Accessibility**: ARIA labels and keyboard navigation support

### 🔭 Configurable Metrics

You can locally test other metrics by modifying the `ACTIVE_METRIC` in `src/config.ts`:

```ts
export const ACTIVE_METRIC: MetricKey = 'house_price'; // default

// Options:
// 'house_price'   - Median House Price (Sydney) ~$100k-$130k
// 'jobseekers'    - Jobseeker Recipients ~9k-11k people
// 'cash_rate'     - RBA Cash Rate ~4%-6%
// 'exchange_rate' - AUD/USD Exchange Rate ~0.48-0.52 USD
```

> The deployed demo uses the default `'house_price'` metric.

## 📁 Project Structure
```
chart-visualization/
├── public/
│   └── assessment_2.json          # Data file (5000+ records)
├── src/
│   ├── components/
│   │   ├── DataChart.tsx           # Main container component
│   │   ├── ChartControls.tsx       # Time grouping & chart type controls
│   │   ├── ChartView.tsx           # Recharts visualization
│   │   └── Tooltip.tsx             # Display detail data for current hover point
│   ├── hooks/
│   │   └── useChartData.ts         # Data processing hook
│   ├── types/
│   │   ├── data.types.ts           # Data type definitions
│   │   └── chart.types.ts          # Chart configuration types
│   ├── utils/
│   │   ├── constants.ts            # Configuration constants
│   │   ├── dateFormatters.ts       # Date formatting utilities
│   │   ├── dataTransform.ts        # Data transformation utilities
│   │   ├── aggregations.ts         # Time aggregation algorithms
│   │   └── chartHelpers.ts         # Chart calculation helpers
│   ├── test/
│   │   ├── setup.ts                # Test environment setup
│   │   └── vitest.d.ts             # Test type declarations
│   ├── App.tsx                     # Application entry point
│   ├── main.tsx                    # React DOM entry
│   └── index.css                   # Global styles
```

## 🧪 Testing & Coverage

**Test Commands**

```bash
npm run test           # Run all tests
npm run test:ui        # Run tests in UI mode
npm run test:coverage  # Generate coverage report
```

**Latest Test Summary**

```
Test Files:  11 passed
Tests:       159 passed
Duration:    4.69s
```

**Coverage Report**

| Category             | % Stmts  | % Branch  | % Funcs   | % Lines  |
| -------------------- | -------- | --------- | --------- | -------- |
| **All files**        | **91.9** | **83.11** | **98.38** | **92.3** |
| src                  | 100      | 100       | 100       | 100      |
| src/components       | 87.5     | 78.37     | 93.75     | 87.09    |
| └─ ChartControls.tsx | 100      | 100       | 100       | 100      |
| └─ ChartView.tsx     | 88.23    | 92.3      | 66.66     | 88.23    |
| └─ DataChart.tsx     | 82.85    | 58.82     | 100       | 81.81    |
| └─ Tooltip.tsx       | 100      | 100       | 100       | 100      |
| src/hooks            | 95.65    | 90.9      | 100       | 95.65    |
| └─ useChartData.ts   | 95.65    | 90.9      | 100       | 95.65    |
| src/utils            | 92.6     | 83.96     | 100       | 93.33    |
| └─ aggregations.ts   | 100      | 75        | 100       | 100      |
| └─ chartHelpers.ts   | 91.48    | 81.25     | 100       | 97.5     |
| └─ constants.ts      | 90.9     | 50        | 100       | 90.9     |
| └─ dataTransform.ts  | 95.91    | 89.47     | 100       | 95.45    |
| └─ dateFormatters.ts | 83.05    | 100       | 100       | 83.05    |


## ⚙️ Development

**Run locally:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

**Preview build:**

```bash
npm run preview
```