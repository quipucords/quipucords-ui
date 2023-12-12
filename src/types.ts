export type CredentialType = {
  id: string;
  name: string;
};

export type ConnectionType = {
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
  connection: ConnectionType;
};
