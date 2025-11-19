/**
 * Defines TypeScript types for handling credentials, source connections, sources, connections, and scans within the
 * application. These types include detailed structures for data related to authentication credentials,
 * network sources and their connections, as well as comprehensive information about scans and their outcomes.
 */

/**
 * Base type containing fields shared between CredentialRequest and CredentialResponse
 */
export type CredentialBase = {
  name: string;
  cred_type: string;
  username: string;
  become_method: string;
  become_user: string;
};

/**
 * Type representing credential data sent to the API (request payload)
 */
export type CredentialRequest = CredentialBase & {
  password?: string;
  ssh_key?: string;
  auth_token?: string;
  ssh_passphrase?: string;
  become_password?: string;
  id?: number;
};

/**
 * Type representing credential data received from the API (response)
 */
export type CredentialResponse = CredentialBase & {
  id: number;
  created_at: Date;
  updated_at: Date;
  sources: SourceType[];
  auth_type: string;
  has_password?: boolean;
  has_ssh_key?: boolean;
  has_ssh_passphrase?: boolean;
  has_become_password?: boolean;
  has_auth_token?: boolean;
};

export interface CredentialOption {
  value: string;
  label: string;
  credential: CredentialResponse;
}

export type SourceConnectionType = {
  end_time: string;
  id: number;
  report_id: number;
  source_systems_count: number;
  source_systems_failed: number;
  source_systems_scanned: number;
  source_systems_unreachable: number;
  start_time: string;
  status: string;
  status_details: {
    job_status_message: string;
  };
  systems_count: number;
  systems_scanned: number;
  systems_failed: number;
};

export type SourceType = {
  id: number;
  name: string;
  port: number;
  source_type: string;
  hosts: string[];
  exclude_hosts: string[];
  credentials: CredentialResponse[];
  connection: SourceConnectionType;
  ssl_protocol?: string;
  ssl_cert_verify: boolean;
  disable_ssl: boolean;
  use_paramiko?: boolean;
  proxy_url?: string;
};

export type ConnectionType = {
  name: string;
  status: string;
  source: {
    id: number;
    name: string;
    source_type: string;
  };
  credentials: {
    id: number;
    name: string;
  };
};

// note: this is basically ScanJobSerializerV1
export type ScanJobType = {
  id: number;
  scan: {
    id: number;
    name: string;
  };
  sources: [
    {
      id: number;
      name: string;
      source_type: string;
    }
  ];
  scan_type: string;
  status: string;
  status_message: string;
  tasks: [
    {
      sequence_number: number;
      source: number;
      scan_type: string;
      status: string;
      status_message: string;
      systems_count: number;
      systems_scanned: number;
      systems_failed: number;
      systems_unreachable: number;
      start_time: Date;
      end_time: Date;
    },
    {
      sequence_number: number;
      source: number;
      scan_type: string;
      status: string;
      status_message: string;
      systems_count: number;
      systems_scanned: number;
      systems_failed: number;
      systems_unreachable: number;
      start_time: Date;
      end_time: Date;
    },
    {
      sequence_number: number;
      scan_type: string;
      status: string;
      status_message: string;
      systems_count: number;
      systems_scanned: number;
      systems_failed: number;
      systems_unreachable: number;
      start_time: Date;
      end_time: Date;
      system_fingerprint_count: number;
    }
  ];
  options: {
    max_concurrency: number;
    enabled_extended_product_search: {
      jboss_eap: false;
      jboss_fuse: false;
      jboss_ws: false;
    };
  };
  report_id: number;
  start_time: Date;
  end_time?: Date;
  systems_count: number;
  systems_scanned: number;
  systems_failed: number;
  systems_unreachable: number;
  system_fingerprint_count: number;
};

export type ScanJobsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ScanJobType[];
};

export type ReportAggregateResultsType = {
  ansible_hosts_all: number;
  instances_hypervisor: number;
  instances_physical: number;
  instances_virtual: number;
  openshift_cores: number;
  socket_pairs: number;
  system_creation_date_average: Date;
  vmware_hosts: number;
};

export type ReportAggregateDiagnosticsType = {
  inspect_result_status_failed: number;
  inspect_result_status_success: number;
  inspect_result_status_unknown: number;
  inspect_result_status_unreachable: number;
  missing_pem_files: number;
  missing_system_creation_date: number;
  missing_system_purpose: number;
};

export type ReportsAggregateResponse = {
  results: ReportAggregateResultsType;
  diagnostics: ReportAggregateDiagnosticsType;
};

export type ScanDisableOptionalProducts = {
  jboss_eap: boolean;
  jboss_fuse: boolean;
  jboss_ws: boolean;
};

export type ScanExtendedSearchProducts = {
  jboss_eap: boolean;
  jboss_fuse: boolean;
  jboss_ws: boolean;
  search_directories: string[];
};

export type ScanOptions = {
  max_concurrency: number;
  disabled_optional_products: ScanDisableOptionalProducts;
  enabled_extended_product_search: ScanExtendedSearchProducts;
};

export type scanJob = {
  id: number;
  report_id: number;
  status: string;
};

// This is backend `SimpleScanJobSerializer`.
// This is basically a ScanJob, but with fewer fields and with `id` renamed to `job_id`.
export type simpleScanJob = {
  job_id: number;
  report_id: number;
  scan_id: number;
  scan_type: string;
  status: string;
  status_message: string;
};

export type StatusDetails = {
  job_status_message: string;
};

// TODO: Considerations for a future refactor: merge and/or rename scanJob and MostRecentScan.
// Reason: the object returned from the api representing scanJob and MostRecentScan are the same;
// also, in quipucords jargon, MostRecentScan is a ScanJob, not a Scan.
export type MostRecentScan = {
  id: number;
  report_id: number;
  start_time: string;
  end_time: string;
  systems_count: number;
  systems_scanned: number;
  systems_failed: number;
  systems_unreachable: number;
  systems_fingerprint_count: number;
  status: string;
  scan_type: 'inspect' | 'connect';
  status_details: StatusDetails;
};

/**
 * Base type containing fields shared between ScanRequest and ScanResponse
 */
export type ScanBase = {
  name: string;
  scan_type: 'inspect' | 'connect';
  options: ScanOptions;
};

/**
 * Type representing scan data sent to the API (request payload)
 */
export type ScanRequest = ScanBase & {
  sources: number[];
  id?: number;
};

/**
 * Type representing scan data received from the API (response)
 */
export type ScanResponse = ScanBase & {
  id: number;
  sources: SourceType[];
  jobs?: scanJob[];
  most_recent?: MostRecentScan;
};

export type Task = {
  sequence_number: number;
  source: number;
  scan_type: string;
  status: string;
  status_message: string;
  systems_count: number;
  systems_scanned: number;
  systems_failed: number;
  systems_unreachable: number;
  start_time: Date;
  end_time: Date;
  system_fingerprint_count?: number; // Optional
};

export type Connections = {
  successful: Pick<ConnectionType, 'name'>[];
  failed: Pick<ConnectionType, 'name'>[];
  unreachable: Pick<ConnectionType, 'name'>[];
};
