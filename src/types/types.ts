/**
 * Defines TypeScript types for handling credentials, source connections, sources, connections, and scans within the
 * application. These types include detailed structures for data related to authentication credentials,
 * network sources and their connections, as well as comprehensive information about scans and their outcomes.
 */
export type CredentialType = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  cred_type: string;
  username: string;
  password: string;
  ssh_keyfile: string;
  auth_token: string;
  ssh_passphrase: string;
  become_method: string;
  become_user: string;
  become_password: string;
  sources: SourceType[];
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

export type ScanType = {
  id: number;
  jobs: { id: number; report_id?: number }[];
  most_recent: {
    end_time: string;
    id: number;
    report_id?: number;
    scan_type: string;
    start_time: string;
    status: string;
    status_details: {
      job_status_message: string;
    };
    system_fingerprint_count: number;
    systems_count: number;
    systems_failed: number;
    systems_scanned: number;
    systems_unreachable: number;
  };
  sources: SourceType[];
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
      jboss_brms: false;
      jboss_ws: false;
    };
  };
  report_id: number;
  start_time: Date;
  end_time: Date;
  systems_count: number;
  systems_scanned: number;
  systems_failed: number;
  systems_unreachable: number;
  system_fingerprint_count: number;
};
