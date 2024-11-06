/**
 * Defines TypeScript types for handling credentials, source connections, sources, connections, and scans within the
 * application. These types include detailed structures for data related to authentication credentials,
 * network sources and their connections, as well as comprehensive information about scans and their outcomes.
 */
export type CredentialType = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  cred_type: string;
  username: string;
  password: string;
  ssh_key: string;
  auth_token: string;
  ssh_passphrase: string;
  become_method: string;
  become_user: string;
  become_password: string;
  sources: SourceType[];
  auth_type: string;
};

export type CredentialErrorType = {
  name: string;
  cred_type: string;
  username: string;
  password: string;
  ssh_key: string;
  auth_token: string;
  ssh_passphrase: string;
  become_method: string;
  become_user: string;
  become_password: string;
  auth_type: string;
};

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
  credentials: CredentialType[];
  connection: SourceConnectionType;
  options?: {
    ssl_protocol?: string;
    ssl_cert_verify: boolean;
    disable_ssl: boolean;
    use_paramiko?: boolean;
  };
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
};

export type StatusDetails = {
  job_status_message: string;
};

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

export type Scan = {
  id: number;
  name: string;
  scan_type: 'inspect' | 'connect';
  options: ScanOptions;
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
