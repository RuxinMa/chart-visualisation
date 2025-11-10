import { describe, it, expect } from 'vitest';
import {
  ALL_METRICS,
  PRIMARY_METRIC,
  CHART_TYPES,
  TIME_GROUPINGS,
  DEFAULT_CHART_CONFIG,
} from '@/utils/constants';

describe('constants', () => {
  describe('ALL_METRICS', () => {
    it('should have all required metrics', () => {
      expect(ALL_METRICS).toHaveProperty('house_price');
      expect(ALL_METRICS).toHaveProperty('jobseekers');
      expect(ALL_METRICS).toHaveProperty('cash_rate');
      expect(ALL_METRICS).toHaveProperty('exchange_rate');
    });

    it('should have correct structure', () => {
      const metric = ALL_METRICS.house_price;
      
      expect(metric).toHaveProperty('key');
      expect(metric).toHaveProperty('label');
      expect(metric).toHaveProperty('color');
      expect(metric).toHaveProperty('formatValue');
      expect(metric).toHaveProperty('description');
      expect(typeof metric.formatValue).toBe('function');
    });

    it('should format house price correctly', () => {
      // House price formats as "$120K"
      const formatted = ALL_METRICS.house_price.formatValue(120000);
      expect(formatted).toBe('$120K');
    });

    it('should format cash rate correctly', () => {
      // Cash rate formats as "5.05%"
      const formatted = ALL_METRICS.cash_rate.formatValue(5.05);
      expect(formatted).toBe('5.05%');
    });

    it('should format jobseekers correctly', () => {
      // Jobseekers formats as "10,000"
      const formatted = ALL_METRICS.jobseekers.formatValue(10000);
      expect(formatted).toContain('10,000');
    });

    it('should format exchange rate correctly', () => {
      // Exchange rate formats as "$0.4796"
      const formatted = ALL_METRICS.exchange_rate.formatValue(4796);
      expect(formatted).toBe('$0.4796');
    });

    it('should have valid colors', () => {
      Object.values(ALL_METRICS).forEach(metric => {
        expect(metric.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('PRIMARY_METRIC', () => {
    it('should be defined', () => {
      expect(PRIMARY_METRIC).toBeDefined();
    });

    it('should be one of ALL_METRICS', () => {
      const allMetricKeys = Object.values(ALL_METRICS).map(m => m.key);
      expect(allMetricKeys).toContain(PRIMARY_METRIC.key);
    });

    it('should have formatValue function', () => {
      expect(typeof PRIMARY_METRIC.formatValue).toBe('function');
    });
  });

  describe('CHART_TYPES', () => {
    it('should have correct length', () => {
      expect(CHART_TYPES).toHaveLength(3);
    });

    it('should have required chart types', () => {
      const types = CHART_TYPES.map(t => t.value);
      expect(types).toContain('line');
      expect(types).toContain('bar');
      expect(types).toContain('scatter');
    });

    it('should have labels', () => {
      CHART_TYPES.forEach(type => {
        expect(type).toHaveProperty('label');
        expect(typeof type.label).toBe('string');
      });
    });
  });

  describe('TIME_GROUPINGS', () => {
    it('should have correct length', () => {
      expect(TIME_GROUPINGS).toHaveLength(4);
    });

    it('should have required groupings', () => {
      const groupings = TIME_GROUPINGS.map(g => g.value);
      expect(groupings).toContain('daily');
      expect(groupings).toContain('weekly');
      expect(groupings).toContain('fortnightly');
      expect(groupings).toContain('monthly');
    });

    it('should have labels', () => {
      TIME_GROUPINGS.forEach(grouping => {
        expect(grouping).toHaveProperty('label');
        expect(typeof grouping.label).toBe('string');
      });
    });
  });

  describe('DEFAULT_CHART_CONFIG', () => {
    it('should have default chart type', () => {
      expect(DEFAULT_CHART_CONFIG.chartType).toBe('line');
    });

    it('should have default time grouping', () => {
      expect(DEFAULT_CHART_CONFIG.timeGrouping).toBe('daily');
    });
  });
});