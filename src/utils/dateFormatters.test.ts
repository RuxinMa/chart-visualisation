import { describe, it, expect } from 'vitest';
import {
  formatDailyDate,
  formatWeeklyDate,
  formatFortnightlyDate,
  formatMonthlyDate,
  formatTooltipDate,
  getWeekStart,
  getMonthStart,
} from './dateFormatters';

describe('dateFormatters', () => {
  describe('formatDailyDate', () => {
    it('should format date as "DD MMM YYYY"', () => {
      expect(formatDailyDate('2023-01-01')).toBe('01 Jan 2023');
      expect(formatDailyDate('2023-12-31')).toBe('31 Dec 2023');
      expect(formatDailyDate('2023-06-15')).toBe('15 Jun 2023');
    });

    it('should handle invalid dates gracefully', () => {
      expect(formatDailyDate('invalid-date')).toBe('Invalid Date');
      expect(formatDailyDate('')).toBe('Invalid Date');
    });

    it('should handle edge cases', () => {
      expect(formatDailyDate('2024-02-29')).toBe('29 Feb 2024'); // Leap year
      expect(formatDailyDate('2023-02-28')).toBe('28 Feb 2023');
    });
  });

  describe('formatWeeklyDate', () => {
    it('should format date as "Week of DD MMM YYYY"', () => {
      // 2023-01-01 is Sunday, week starts Monday 2023-01-02 (our config)
      // Actually, let's test with a known Monday
      expect(formatWeeklyDate('2023-01-02')).toBe('Week of 02 Jan 2023');
      expect(formatWeeklyDate('2023-01-09')).toBe('Week of 09 Jan 2023');
    });

    it('should use Monday as week start', () => {
      // 2023-01-05 is Thursday, should show Week of 02 Jan 2023 (Monday)
      expect(formatWeeklyDate('2023-01-05')).toBe('Week of 02 Jan 2023');
    });

    it('should handle invalid dates', () => {
      expect(formatWeeklyDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('formatFortnightlyDate', () => {
    it('should format date range as "DD MMM - DD MMM YYYY"', () => {
      // 2023-01-01 + 13 days = 2023-01-14
      expect(formatFortnightlyDate('2023-01-01')).toBe('01 Jan - 14 Jan 2023');
    });

    it('should handle cross-month fortnights', () => {
      // 2023-01-25 + 13 days = 2023-02-07
      expect(formatFortnightlyDate('2023-01-25')).toBe('25 Jan - 07 Feb 2023');
    });

    it('should handle invalid dates', () => {
      expect(formatFortnightlyDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('formatMonthlyDate', () => {
    it('should format date as "MMM YYYY"', () => {
      expect(formatMonthlyDate('2023-01-01')).toBe('Jan 2023');
      expect(formatMonthlyDate('2023-01-15')).toBe('Jan 2023');
      expect(formatMonthlyDate('2023-12-31')).toBe('Dec 2023');
    });

    it('should handle all months', () => {
      expect(formatMonthlyDate('2023-02-01')).toBe('Feb 2023');
      expect(formatMonthlyDate('2023-06-15')).toBe('Jun 2023');
      expect(formatMonthlyDate('2023-09-30')).toBe('Sep 2023');
    });

    it('should handle invalid dates', () => {
      expect(formatMonthlyDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('formatTooltipDate', () => {
    it('should format date with day of week', () => {
      // 2023-01-01 is Sunday
      expect(formatTooltipDate('2023-01-01')).toBe('Sun, 01 Jan 2023');
      // 2023-01-02 is Monday
      expect(formatTooltipDate('2023-01-02')).toBe('Mon, 02 Jan 2023');
    });

    it('should handle invalid dates', () => {
      expect(formatTooltipDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('getWeekStart', () => {
    it('should return ISO date of week start (Monday)', () => {
      // 2023-01-05 is Thursday, week starts 2023-01-02 (Monday)
      expect(getWeekStart('2023-01-05')).toBe('2023-01-02');
      
      // 2023-01-02 is Monday, should return same date
      expect(getWeekStart('2023-01-02')).toBe('2023-01-02');
    });

    it('should handle Sunday (returns previous Monday)', () => {
      // 2023-01-01 is Sunday, week starts 2022-12-26 (previous Monday)
      expect(getWeekStart('2023-01-01')).toBe('2022-12-26');
    });

    it('should handle invalid dates', () => {
      expect(getWeekStart('invalid')).toBe('invalid');
    });
  });

  describe('getMonthStart', () => {
    it('should return ISO date of month start', () => {
      expect(getMonthStart('2023-01-15')).toBe('2023-01-01');
      expect(getMonthStart('2023-06-30')).toBe('2023-06-01');
      expect(getMonthStart('2023-12-25')).toBe('2023-12-01');
    });

    it('should handle first day of month', () => {
      expect(getMonthStart('2023-01-01')).toBe('2023-01-01');
    });

    it('should handle invalid dates', () => {
      expect(getMonthStart('invalid')).toBe('invalid');
    });
  });
});