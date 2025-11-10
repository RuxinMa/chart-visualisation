/**
 * Date formatting utilities
 * 
 * Formats dates according to different time groupings:
 * - Daily: "15 Jan 2023"
 * - Weekly: "Week of 15 Jan 2023"
 * - Fortnightly: "15 Jan - 28 Jan 2023"
 * - Monthly: "Jan 2023"
 */

import { 
  format, 
  parseISO, 
  startOfWeek, 
  addDays,
  startOfMonth,
  isValid 
} from 'date-fns';
import { AGGREGATION_CONFIG } from '@/config';

/**
 * Format date for daily view
 * @param dateStr - ISO date string "YYYY-MM-DD"
 * @returns Formatted string "DD MMM YYYY" (e.g., "15 Jan 2023")
 */
export const formatDailyDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    return format(date, 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting daily date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date for weekly view
 * @param dateStr - ISO date string "YYYY-MM-DD"
 * @returns Formatted string "Week of DD MMM YYYY" (e.g., "Week of 15 Jan 2023")
 */
export const formatWeeklyDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    
    // Get the start of the week (Monday)
    const weekStart = startOfWeek(date, { 
      weekStartsOn: AGGREGATION_CONFIG.weekStartsOn 
    });
    
    return `Week of ${format(weekStart, 'dd MMM yyyy')}`;
  } catch (error) {
    console.error('Error formatting weekly date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date for fortnightly view
 * @param dateStr - ISO date string "YYYY-MM-DD"
 * @returns Formatted string "DD MMM - DD MMM YYYY" (e.g., "01 Jan - 14 Jan 2023")
 */
export const formatFortnightlyDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    
    // Fortnight starts from the given date
    const fortnightStart = date;
    const fortnightEnd = addDays(fortnightStart, AGGREGATION_CONFIG.fortnightDays - 1);
    
    // If same year, don't repeat the year
    const startFormatted = format(fortnightStart, 'dd MMM');
    const endFormatted = format(fortnightEnd, 'dd MMM yyyy');
    
    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error('Error formatting fortnightly date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date for monthly view
 * @param dateStr - ISO date string "YYYY-MM-DD"
 * @returns Formatted string "MMM YYYY" (e.g., "Jan 2023")
 */
export const formatMonthlyDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    
    return format(date, 'MMM yyyy');
  } catch (error) {
    console.error('Error formatting monthly date:', error);
    return 'Invalid Date';
  }
};

/**
 * Get the start of week for a given date
 * @param dateStr - ISO date string "YYYY-MM-DD"
 * @returns ISO date string of the week start
 */
export const getWeekStart = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    const weekStart = startOfWeek(date, { 
      weekStartsOn: AGGREGATION_CONFIG.weekStartsOn 
    });
    return format(weekStart, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error getting week start:', error);
    return dateStr;
  }
};

/**
 * Get the start of month for a given date
 * @param dateStr - ISO date string "YYYY-MM-DD"
 * @returns ISO date string of the month start
 */
export const getMonthStart = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    const monthStart = startOfMonth(date);
    return format(monthStart, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error getting month start:', error);
    return dateStr;
  }
};

/**
 * Format date for chart tooltip
 * More detailed format with day of week
 * @param dateStr - ISO date string "YYYY-MM-DD"
 * @returns Formatted string "EEE, DD MMM YYYY" (e.g., "Mon, 15 Jan 2023")
 */
export const formatTooltipDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    return format(date, 'EEE, dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting tooltip date:', error);
    return 'Invalid Date';
  }
};