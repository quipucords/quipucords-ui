import { credentialsService } from './credentialsService';
import { factsService } from './factsService';
import { reportsService } from './reportsService';
import { scansService } from './scansService';
import { sourcesService } from './sourcesService';
import { statusService } from './statusService';
import { userService } from './userService';

const services = {
  credentials: credentialsService,
  facts: factsService,
  reports: reportsService,
  scans: scansService,
  sources: sourcesService,
  status: statusService,
  user: userService
};

export {
  services as default,
  services,
  credentialsService,
  factsService,
  reportsService,
  scansService,
  sourcesService,
  statusService,
  userService
};
