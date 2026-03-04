import { type ReportType } from '../types/types';

export const buildReport = (overrides?: Partial<ReportType>): ReportType => ({
  id: 1,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  report_version: '1.0',
  report_platform_id: 'test-platform-id',
  origin: 'local',
  scan_id: 1,
  can_publish: true,
  cannot_publish_reason: null,
  can_download: true,
  cannot_download_reason: null,
  ...overrides
});
