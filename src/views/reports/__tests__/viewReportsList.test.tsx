import { createNewerThanValidator, createOlderThanValidator, formatReportDate } from '../reportUtils';

describe('date range validators', () => {
  const errorMsg = 'Date range is inverted';
  const olderKey = 'created_at__lte';
  const newerKey = 'created_at__gte';

  describe('createNewerThanValidator', () => {
    it('should return empty string when no older-than value is set', () => {
      const validator = createNewerThanValidator(olderKey, errorMsg);
      expect(validator(new Date('2025-06-01'), {})).toBe('');
    });

    it('should return empty string when newer-than date is before older-than date', () => {
      const validator = createNewerThanValidator(olderKey, errorMsg);
      expect(validator(new Date('2025-06-01'), { [olderKey]: ['2025-12-01'] })).toBe('');
    });

    it('should return empty string when dates are equal', () => {
      const validator = createNewerThanValidator(olderKey, errorMsg);
      expect(validator(new Date('2025-06-01'), { [olderKey]: ['2025-06-01'] })).toBe('');
    });

    it('should return error when newer-than date is after older-than date', () => {
      const validator = createNewerThanValidator(olderKey, errorMsg);
      expect(validator(new Date('2025-06-01'), { [olderKey]: ['2025-01-01'] })).toBe(errorMsg);
    });
  });

  describe('createOlderThanValidator', () => {
    it('should return empty string when no newer-than value is set', () => {
      const validator = createOlderThanValidator(newerKey, errorMsg);
      expect(validator(new Date('2025-06-01'), {})).toBe('');
    });

    it('should return empty string when older-than date is after newer-than date', () => {
      const validator = createOlderThanValidator(newerKey, errorMsg);
      expect(validator(new Date('2025-06-01'), { [newerKey]: ['2025-01-01'] })).toBe('');
    });

    it('should return empty string when dates are equal', () => {
      const validator = createOlderThanValidator(newerKey, errorMsg);
      expect(validator(new Date('2025-06-01'), { [newerKey]: ['2025-06-01'] })).toBe('');
    });

    it('should return error when older-than date is before newer-than date', () => {
      const validator = createOlderThanValidator(newerKey, errorMsg);
      expect(validator(new Date('2025-06-01'), { [newerKey]: ['2025-12-01'] })).toBe(errorMsg);
    });
  });
});

describe('formatReportDate', () => {
  it('should format a valid ISO date string', () => {
    expect(formatReportDate('2025-06-15T10:30:00Z')).toBe('15 June 2025, 10:30 AM UTC');
  });

  it('should return the raw string for an invalid date', () => {
    expect(formatReportDate('not-a-date')).toBe('Invalid date');
  });

  it('should handle an empty string', () => {
    expect(formatReportDate('')).toBe('Invalid date');
  });
});
