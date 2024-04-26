import moxios from 'moxios';
import scansService from '../scansService';

describe('ScansService', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(scans|jobs).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(scansService)).toHaveLength(12);
  });

  it('should have specific methods', () => {
    expect(scansService.addScan).toBeDefined();
    expect(scansService.getScans).toBeDefined();
    expect(scansService.getScan).toBeDefined();
    expect(scansService.updateScan).toBeDefined();
    expect(scansService.updatePartialScan).toBeDefined();
    expect(scansService.getScanJobs).toBeDefined();
    expect(scansService.getScanJob).toBeDefined();
    expect(scansService.getConnectionScanResults).toBeDefined();
    expect(scansService.getInspectionScanResults).toBeDefined();
    expect(scansService.deleteScan).toBeDefined();
    expect(scansService.startScan).toBeDefined();
    expect(scansService.cancelScan).toBeDefined();
  });

  it('should return promises for every method', done => {
    const promises = Object.keys(scansService).map(value => scansService[value]());

    Promise.all(promises).then(success => {
      expect(success.length).toEqual(Object.keys(scansService).length);
      done();
    });
  });
});
