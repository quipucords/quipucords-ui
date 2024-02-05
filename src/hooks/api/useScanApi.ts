/**
 * Scan API Hook
 *
 * This hook provides functions for interacting with scan-related API calls,
 * including running and deleting scans, managing report downloads.
 *
 * @module useScanApi
 */
import React from 'react';
import axios from 'axios';
import { ScanType } from 'src/types';

const useScanApi = () => {
  const [pendingDeleteScan, setPendingDeleteScan] = React.useState<ScanType>();
  const [scanSelected, setScanSelected] = React.useState<ScanType>();

  /**
   * Executes a DELETE request to delete a scan.
   *
   * @param {ScanType} [scan] - (Optional) The scan to be deleted. If not provided, it uses `pendingDeleteScan`.
   * @returns {AxiosResponse} - The Axios response object representing the result of the request.
   */
  const deleteScan = (scan?: ScanType) => {
    return axios.delete(
      `${process.env.REACT_APP_SCANS_SERVICE}${(scan || pendingDeleteScan)?.id}/`
    );
  };

  /**
   * Executes a POST request to initiate a scan using the provided payload.
   *
   * @param {ScanType} payload - The payload containing source-related information for the scan.
   * @returns {AxiosResponse} - The Axios response object representing the result of request.
   */
  const runScan = (payload: ScanType) => {
    return axios.post(`${process.env.REACT_APP_SCANS_SERVICE}`, payload);
  };

  /**
   * Deletes several selected scans based on user interaction.
   * Add your logic to handle the deletion of selected items within this function.
   */
  const onDeleteSelectedScans = () => {
    const selectedItems = [];
    console.log('Deleting selected scans:', selectedItems);
  };

  /**
   * Gets a list of scan jobs for a specific scan id
   */
  const getScanJobs = (scanId: number) => {
    return axios.get(`${process.env.REACT_APP_SCANS_SERVICE}${scanId}/jobs/`);
  }

  const downloadReport = (reportId: number) => {
    return axios({
      url: `${process.env.REACT_APP_REPORTS_SERVICE}${reportId}/`,
      method: 'GET',
      responseType: 'blob',
    });
  }

  return {
    deleteScan,
    onDeleteSelectedScans,
    runScan,
    pendingDeleteScan,
    setPendingDeleteScan,
    scanSelected,
    setScanSelected,
    getScanJobs,
    downloadReport,
  };
};
export default useScanApi;
