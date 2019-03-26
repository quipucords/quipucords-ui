const API_RESPONSE_CREDENTIAL_CRED_TYPE = 'cred_type';
const API_RESPONSE_CREDENTIAL_NAME = 'name';
const API_RESPONSE_CREDENTIAL_ID = 'id';

const API_RESPONSE_CREDENTIALS_COUNT = 'count';
const API_RESPONSE_CREDENTIALS_RESULTS = 'results';

const API_RESPONSE_SCAN_ID = 'id';

const API_RESPONSE_SCANS_COUNT = 'count';
const API_RESPONSE_SCANS_RESULTS = 'results';

const API_RESPONSE_JOBS_RESULTS = 'results';

const API_RESPONSE_SOURCE_CONNECTION = 'connection';
const API_RESPONSE_SOURCE_CONNECTION_END_TIME = 'end_time';
const API_RESPONSE_SOURCE_CONNECTION_ID = 'id';
const API_RESPONSE_SOURCE_CONNECTION_START_TIME = 'start_time';
const API_RESPONSE_SOURCE_CONNECTION_STATUS = 'status';
const API_RESPONSE_SOURCE_CONNECTION_SYS_FAILED = 'source_systems_failed';
const API_RESPONSE_SOURCE_CONNECTION_SYS_SCANNED = 'source_systems_scanned';
const API_RESPONSE_SOURCE_CONNECTION_SYS_UNREACHABLE = 'source_systems_unreachable';
const API_RESPONSE_SOURCE_CREDENTIALS = 'credentials';
const API_RESPONSE_SOURCE_CREDENTIALS_ID = 'id';
const API_RESPONSE_SOURCE_CREDENTIALS_NAME = 'name';
const API_RESPONSE_SOURCE_HOSTS = 'hosts';
const API_RESPONSE_SOURCE_ID = 'id';
const API_RESPONSE_SOURCE_NAME = 'name';
const API_RESPONSE_SOURCE_OPTIONS = 'options';
const API_RESPONSE_SOURCE_OPTIONS_SSL_CERT = 'ssl_cert_verify';
const API_RESPONSE_SOURCE_OPTIONS_SSL_PROTOCOL = 'ssl_protocol';
const API_RESPONSE_SOURCE_OPTIONS_DISABLE_SSL = 'disable_ssl';
const API_RESPONSE_SOURCE_OPTIONS_PARAMIKO = 'use_paramiko';
const API_RESPONSE_SOURCE_PORT = 'port';
const API_RESPONSE_SOURCE_SOURCE_TYPE = 'source_type';

const API_RESPONSE_SOURCES_COUNT = 'count';
const API_RESPONSE_SOURCES_RESULTS = 'results';

const API_RESPONSE_STATUS_API_VERSION = 'api_version';
const API_RESPONSE_STATUS_BUILD = 'build';
const API_RESPONSE_STATUS_SERVER_VERSION = 'server_version';

const API_RESPONSE_USER_USERNAME = 'username';

const API_SUBMIT_SCAN_NAME = 'name';
const API_SUBMIT_SCAN_OPTIONS = 'options';
const API_SUBMIT_SCAN_OPTIONS_MAX_CONCURRENCY = 'max_concurrency';
const API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH = 'enabled_extended_product_search';
const API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_BRMS = 'jboss_brms';
const API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_DIRS = 'search_directories';
const API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_EAP = 'jboss_eap';
const API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_FUSE = 'jboss_fuse';
const API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_WS = 'jboss_ws';
const API_SUBMIT_SCAN_SOURCES = 'sources';

const API_SUBMIT_SOURCE_CREDENTIALS = 'credentials';
const API_SUBMIT_SOURCE_HOSTS = 'hosts';
const API_SUBMIT_SOURCE_ID = 'id';
const API_SUBMIT_SOURCE_NAME = 'name';
const API_SUBMIT_SOURCE_OPTIONS = 'options';
const API_SUBMIT_SOURCE_OPTIONS_SSL_CERT = 'ssl_cert_verify';
const API_SUBMIT_SOURCE_OPTIONS_SSL_PROTOCOL = 'ssl_protocol';
const API_SUBMIT_SOURCE_OPTIONS_DISABLE_SSL = 'disable_ssl';
const API_SUBMIT_SOURCE_OPTIONS_PARAMIKO = 'use_paramiko';
const API_SUBMIT_SOURCE_PORT = 'port';
const API_SUBMIT_SOURCE_SOURCE_TYPE = 'source_type';

const apiTypes = {
  API_RESPONSE_CREDENTIAL_CRED_TYPE,
  API_RESPONSE_CREDENTIAL_NAME,
  API_RESPONSE_CREDENTIAL_ID,
  API_RESPONSE_CREDENTIALS_COUNT,
  API_RESPONSE_CREDENTIALS_RESULTS,
  API_RESPONSE_SCAN_ID,
  API_RESPONSE_SCANS_COUNT,
  API_RESPONSE_SCANS_RESULTS,
  API_RESPONSE_JOBS_RESULTS,
  API_RESPONSE_SOURCE_CONNECTION,
  API_RESPONSE_SOURCE_CONNECTION_END_TIME,
  API_RESPONSE_SOURCE_CONNECTION_ID,
  API_RESPONSE_SOURCE_CONNECTION_START_TIME,
  API_RESPONSE_SOURCE_CONNECTION_STATUS,
  API_RESPONSE_SOURCE_CONNECTION_SYS_FAILED,
  API_RESPONSE_SOURCE_CONNECTION_SYS_SCANNED,
  API_RESPONSE_SOURCE_CONNECTION_SYS_UNREACHABLE,
  API_RESPONSE_SOURCE_CREDENTIALS,
  API_RESPONSE_SOURCE_CREDENTIALS_ID,
  API_RESPONSE_SOURCE_CREDENTIALS_NAME,
  API_RESPONSE_SOURCE_HOSTS,
  API_RESPONSE_SOURCE_ID,
  API_RESPONSE_SOURCE_NAME,
  API_RESPONSE_SOURCE_OPTIONS,
  API_RESPONSE_SOURCE_OPTIONS_SSL_CERT,
  API_RESPONSE_SOURCE_OPTIONS_SSL_PROTOCOL,
  API_RESPONSE_SOURCE_OPTIONS_DISABLE_SSL,
  API_RESPONSE_SOURCE_OPTIONS_PARAMIKO,
  API_RESPONSE_SOURCE_PORT,
  API_RESPONSE_SOURCE_SOURCE_TYPE,
  API_RESPONSE_SOURCES_COUNT,
  API_RESPONSE_SOURCES_RESULTS,
  API_RESPONSE_STATUS_API_VERSION,
  API_RESPONSE_STATUS_BUILD,
  API_RESPONSE_STATUS_SERVER_VERSION,
  API_RESPONSE_USER_USERNAME,
  API_SUBMIT_SCAN_NAME,
  API_SUBMIT_SCAN_OPTIONS,
  API_SUBMIT_SCAN_OPTIONS_MAX_CONCURRENCY,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_BRMS,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_DIRS,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_EAP,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_FUSE,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_WS,
  API_SUBMIT_SCAN_SOURCES,
  API_SUBMIT_SOURCE_CREDENTIALS,
  API_SUBMIT_SOURCE_HOSTS,
  API_SUBMIT_SOURCE_ID,
  API_SUBMIT_SOURCE_NAME,
  API_SUBMIT_SOURCE_OPTIONS,
  API_SUBMIT_SOURCE_OPTIONS_SSL_CERT,
  API_SUBMIT_SOURCE_OPTIONS_SSL_PROTOCOL,
  API_SUBMIT_SOURCE_OPTIONS_DISABLE_SSL,
  API_SUBMIT_SOURCE_OPTIONS_PARAMIKO,
  API_SUBMIT_SOURCE_PORT,
  API_SUBMIT_SOURCE_SOURCE_TYPE
};

export {
  apiTypes as default,
  apiTypes,
  API_RESPONSE_CREDENTIAL_CRED_TYPE,
  API_RESPONSE_CREDENTIAL_NAME,
  API_RESPONSE_CREDENTIAL_ID,
  API_RESPONSE_CREDENTIALS_COUNT,
  API_RESPONSE_CREDENTIALS_RESULTS,
  API_RESPONSE_SCAN_ID,
  API_RESPONSE_SCANS_COUNT,
  API_RESPONSE_SCANS_RESULTS,
  API_RESPONSE_JOBS_RESULTS,
  API_RESPONSE_SOURCE_CONNECTION,
  API_RESPONSE_SOURCE_CONNECTION_END_TIME,
  API_RESPONSE_SOURCE_CONNECTION_ID,
  API_RESPONSE_SOURCE_CONNECTION_START_TIME,
  API_RESPONSE_SOURCE_CONNECTION_STATUS,
  API_RESPONSE_SOURCE_CONNECTION_SYS_FAILED,
  API_RESPONSE_SOURCE_CONNECTION_SYS_SCANNED,
  API_RESPONSE_SOURCE_CONNECTION_SYS_UNREACHABLE,
  API_RESPONSE_SOURCE_CREDENTIALS,
  API_RESPONSE_SOURCE_CREDENTIALS_ID,
  API_RESPONSE_SOURCE_CREDENTIALS_NAME,
  API_RESPONSE_SOURCE_HOSTS,
  API_RESPONSE_SOURCE_ID,
  API_RESPONSE_SOURCE_NAME,
  API_RESPONSE_SOURCE_OPTIONS,
  API_RESPONSE_SOURCE_OPTIONS_SSL_CERT,
  API_RESPONSE_SOURCE_OPTIONS_SSL_PROTOCOL,
  API_RESPONSE_SOURCE_OPTIONS_DISABLE_SSL,
  API_RESPONSE_SOURCE_OPTIONS_PARAMIKO,
  API_RESPONSE_SOURCE_PORT,
  API_RESPONSE_SOURCE_SOURCE_TYPE,
  API_RESPONSE_SOURCES_COUNT,
  API_RESPONSE_SOURCES_RESULTS,
  API_RESPONSE_STATUS_API_VERSION,
  API_RESPONSE_STATUS_BUILD,
  API_RESPONSE_STATUS_SERVER_VERSION,
  API_RESPONSE_USER_USERNAME,
  API_SUBMIT_SCAN_NAME,
  API_SUBMIT_SCAN_OPTIONS,
  API_SUBMIT_SCAN_OPTIONS_MAX_CONCURRENCY,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_BRMS,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_DIRS,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_EAP,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_FUSE,
  API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_WS,
  API_SUBMIT_SCAN_SOURCES,
  API_SUBMIT_SOURCE_CREDENTIALS,
  API_SUBMIT_SOURCE_HOSTS,
  API_SUBMIT_SOURCE_ID,
  API_SUBMIT_SOURCE_NAME,
  API_SUBMIT_SOURCE_OPTIONS,
  API_SUBMIT_SOURCE_OPTIONS_SSL_CERT,
  API_SUBMIT_SOURCE_OPTIONS_SSL_PROTOCOL,
  API_SUBMIT_SOURCE_OPTIONS_DISABLE_SSL,
  API_SUBMIT_SOURCE_OPTIONS_PARAMIKO,
  API_SUBMIT_SOURCE_PORT,
  API_SUBMIT_SOURCE_SOURCE_TYPE
};
