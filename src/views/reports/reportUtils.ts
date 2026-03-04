import { helpers } from '../../helpers';

/**
 * Cross-field date validators for "newer than" / "older than" filter pairs.
 * Return an error message when the date creates an inverted range,
 * or empty string when valid (PatternFly DatePicker convention).
 * The second parameter (filterValues) is provided by DateFilterControl at call time.
 */
export const createNewerThanValidator =
  (olderThanKey: string, errorMessage: string) =>
  (date: Date, filterValues: Record<string, string[] | undefined | null>): string => {
    const olderThan = filterValues[olderThanKey]?.[0];
    if (olderThan && date > new Date(olderThan)) {
      return errorMessage;
    }
    return '';
  };

export const createOlderThanValidator =
  (newerThanKey: string, errorMessage: string) =>
  (date: Date, filterValues: Record<string, string[] | undefined | null>): string => {
    const newerThan = filterValues[newerThanKey]?.[0];
    if (newerThan && date < new Date(newerThan)) {
      return errorMessage;
    }
    return '';
  };

export const formatReportDate = (dateString: string): string => {
  try {
    return helpers.formatDate(new Date(dateString));
  } catch {
    return dateString;
  }
};
