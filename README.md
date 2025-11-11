# Chart Visualization Assessment

Interactive data visualization app built with **React, TypeScript, Tailwind CSS**, and **Recharts** using data from *assessment_2.json*. Supports multiple aggregation levels and chart types.

## 🌐 Live Demo

[Deploy on Vercel](https://chart-visualisation.vercel.app/)

---

## 🛠️ Tech Stack

* **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**
* **Recharts** for visualization, **date-fns** for date manipulation
* **Vitest** + **React Testing Library** for testing
* **ESLint** and TypeScript strict mode for code quality


## 🎯 Features Implemented

### ✅ Task 2a: Basic Line Chart
> ⚠️ **Design Note:** After analysing the dataset and user requirements, this chart component was designed to display **a single metric at a time**.
>
> Displaying all metrics together could overwhelm users due to large differences in scales. This ensures clarity, readability, and a better user experience.
> In a local environment, other metrics can be tested via configuration—see **Configurable Metrics** in the Development section below for details.

- Interactive line chart with hover tooltips
- Date formatting (DD MMM YYYY)
- Grid lines, axis labels, and legend
- Brush component for time range selection

### ✅ Task 2b: Time Aggregation
- Support for **daily**, **weekly**, **fortnightly**, and **monthly** aggregation
- Dynamic date formatting based on aggregation level
- Averages computed for aggregated periods

### ✅ Task 2c: Chart Type Switching
- **Line**, **Bar**, and **Scatter** chart options
- Smooth transitions between chart types

### 🌟 Bonus Features
- **Dynamic Y-axis Range**: Automatically adapts to metric values
- **Responsive Design** for desktop and mobile
- **Data Statistics** showing record counts


> **Future Enhancements:**
>
>* **Accessibility:** Improve accessibility by adding ARIA labels, roles, and keyboard navigation support across chart components.
>* **Enhanced Visualization:** Add a metric selection panel in the UI to switch metrics dynamically without modifying the code.
>* **Data Insights:** Display basic summary statistics (e.g., total, average, max/min) alongside the chart for quick reference.


## 📁 Project Structure
```
chart-visualization/
├── public/
│   └── assessment_2.json
├── src/
│   ├── components/
│   │   ├── DataChart.tsx
│   │   ├── ChartControls.tsx
│   │   ├── ChartView.tsx
│   │   └── Tooltip.tsx
│   ├── hooks/
│   │   └── useChartData.ts
│   ├── types/
│   │   ├── data.types.ts
│   │   └── chart.types.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── dateFormatters.ts
│   │   ├── dataTransform.ts
│   │   ├── aggregations.ts
│   │   └── chartHelpers.ts
│   ├── test/
│   │   ├── setup.ts
│   │   └── vitest.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css

````

## 🧪 Testing & Coverage

**Test Commands**

```bash
npm run test           # Run all tests
npm run test:ui        # Run tests in UI mode
npm run test:coverage  # Generate coverage report
````

**Latest Test Summary**

```
Test Files:  11 passed
Tests:       160 passed
Duration:    3.03s
```

**Coverage Report**

| Category       | % Stmts  | % Branch  | % Funcs   | % Lines  |
| -------------- | -------- | --------- | --------- | -------- |
| **All files**  | **91.9** | **83.11** | **98.38** | **92.3** |
| src/components | 87.5     | 78.37     | 93.75     | 87.09    |
| src/hooks      | 95.65    | 90.9      | 100       | 95.65    |
| src/utils      | 92.6     | 83.96     | 100       | 93.33    |


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

### 🔭 Configurable Metrics

* The source JSON contains multiple metrics across different scales.
* By default, the demo displays **only one metric** to maintain clarity and usability.
* You can test other metrics locally by editing `src/config.ts`:

```ts
export const ACTIVE_METRIC: MetricKey = 'house_price'; // default

// Options:
// 'house_price'   - Median House Price (Sydney) ~$100k-$130k
// 'jobseekers'    - Jobseeker Recipients ~9k-11k people
// 'cash_rate'     - RBA Cash Rate ~4%-6%
// 'exchange_rate' - AUD/USD Exchange Rate ~0.48-0.52 USD
```
