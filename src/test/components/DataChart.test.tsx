import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataChart } from '../../components/DataChart';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

const mockData = [
  {
    date: '2023-01-01',
    median_house_price_syd: 120000,
    jobseeker_recipients: 10000,
    rba_cash_rate: 5.0,
    aud_usd_exchange: 5000,
  },
  {
    date: '2023-01-02',
    median_house_price_syd: 121000,
    jobseeker_recipients: 10100,
    rba_cash_rate: 5.1,
    aud_usd_exchange: 5050,
  },
];


describe('DataChart', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<DataChart data={mockData} />);
      expect(screen.getByTestId('chart-header')).toBeInTheDocument();
    });

    it('should display heading', () => {
      render(<DataChart data={mockData} />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should display description', () => {
      render(<DataChart data={mockData} />);
      expect(screen.getByTestId('chart-description')).toBeInTheDocument();
    });

    it('should render main content area', () => {
      render(<DataChart data={mockData} />);
      expect(screen.getByTestId('chart-main')).toBeInTheDocument();
    });
  });

  describe('With Provided Data', () => {
    it('should render chart controls', () => {
      render(<DataChart data={mockData} />);
      expect(screen.getByTestId('chart-controls')).toBeInTheDocument();
    });

    it('should render chart view', () => {
      render(<DataChart data={mockData} />);
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();
    });

    it('should not show loading state', () => {
      render(<DataChart data={mockData} />);
      expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument();
    });

    it('should not show error state', () => {
      render(<DataChart data={mockData} />);
      expect(screen.queryByText(/Failed to Load Data/i)).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when no data provided', () => {
      // Mock fetch to never resolve
      global.fetch = vi.fn(() => new Promise(() => {}));

      render(<DataChart />);
      
      expect(screen.getByText(/Loading chart data/i)).toBeInTheDocument();
      expect(screen.queryByTestId('chart-controls')).not.toBeInTheDocument();

      vi.restoreAllMocks();
    });
  });

  describe('Component Structure', () => {
    it('should have proper container structure', () => {
      const { container } = render(<DataChart data={mockData} />);
      
      expect(container.querySelector('[data-testid="chart-header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="chart-main"]')).toBeInTheDocument();
    });

    it('should render all major sections', () => {
      render(<DataChart data={mockData} />);
      
      // Header
      expect(screen.getByTestId('chart-header')).toBeInTheDocument();
      
      // Main content
      expect(screen.getByTestId('chart-main')).toBeInTheDocument();
      
      // Controls and chart
      expect(screen.getByTestId('chart-controls')).toBeInTheDocument();
      expect(screen.getByTestId('chart-view')).toBeInTheDocument();
    });
  });
});

describe('Error State Handling', () => {
  it('should show error message when fetch fails', async () => {
    const mockError = new Error('Network failure');
    global.fetch = vi.fn(() => Promise.reject(mockError)) as any;

    render(<DataChart />);

    await screen.findByText(/Failed to Load Data/i);
    expect(screen.getByText(/Network failure/i)).toBeInTheDocument();

    // Retry button should exist
    const retryBtn = screen.getByRole('button', { name: /Retry/i });
    expect(retryBtn).toBeInTheDocument();
  });

  it('should reload the page when Retry is clicked', async () => {
    // mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    const mockError = new Error('Server Error');
    global.fetch = vi.fn(() => Promise.reject(mockError)) as any;

    render(<DataChart />);
    await screen.findByText(/Failed to Load Data/i);
    const retryBtn = screen.getByRole('button', { name: /Retry/i });
    retryBtn.click();

    expect(mockReload).toHaveBeenCalled();
  });
});

describe('Chart Interaction', () => {
  it('should update chart type when user selects a new type', async () => {
    const user = userEvent.setup();
    render(<DataChart data={mockData} />);

    const barButton = screen.getByTestId('chart-type-bar');
    await user.click(barButton); 

    await waitFor(() => {
      expect(barButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('should update time grouping when user selects a new grouping', async () => {
    const user = userEvent.setup();
    render(<DataChart data={mockData} />);

    const weeklyButton = screen.getByTestId('time-grouping-weekly');
    await user.click(weeklyButton);

    await waitFor(() => {
      expect(weeklyButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});

describe('App Footer', () => {
  it('should display GitHub repo link with icon', () => {
    render(<DataChart data={mockData} />);
    
    const link = screen.getByRole('link', { name: /GitHub Repository/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/RuxinMa/chart-visualisation'
    );
    expect(link).toHaveAttribute('target', '_blank');

    const icon = screen.getByTestId('github-icon');
    expect(icon).toBeInTheDocument();
  });
});
