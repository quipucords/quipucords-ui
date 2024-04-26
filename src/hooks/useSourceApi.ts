/**
 * Source API Hook
 *
 * This hook provides functions for interacting with source-related API calls,
 * including running scans, adding sources, editing sources, deleting sources,
 * retrieving connection information, and managing selected sources.
 *
 * @module useSourceApi
 */
import React from 'react';
import axios from 'axios';
import { ConnectionType, SourceType } from 'src/types/types';

const useSourceApi = () => {
  const [scanSelected, setScanSelected] = React.useState<SourceType[]>();
  const [addSourceModal, setAddSourceModal] = React.useState<string>();
  const [sourceBeingEdited, setSourceBeingEdited] = React.useState<SourceType>();
  const [pendingDeleteSource, setPendingDeleteSource] = React.useState<SourceType>();
  const [connectionsData, setConnectionsData] = React.useState<{
    successful: ConnectionType[];
    failure: ConnectionType[];
    unreachable: ConnectionType[];
  }>({ successful: [], failure: [], unreachable: [] });
  const [connectionsSelected, setConnectionsSelected] = React.useState<SourceType>();
  const emptyConnectionData = { successful: [], failure: [], unreachable: [] };

  /**
   * Executes a POST request to initiate a scan using the provided payload.
   *
   * @param {SourceType} payload - The payload containing source-related information for the scan.
   * @returns {AxiosResponse} - The Axios response object representing the result of request.
   */
  const runScan = (payload: SourceType) => {
    return axios.post(`${process.env.REACT_APP_SCANS_SERVICE}`, payload);
  };

  /**
   * Executes a POST request to add a source, optionally triggering a scan.
   *
   * @param {SourceType} payload - The payload containing information about the source to be added.
   * @returns {AxiosResponse} - The Axios response object representing the result of the request.
   */
  const addSource = (payload: SourceType) => {
    return axios.post(`${process.env.REACT_APP_SOURCES_SERVICE}?scan=true`, payload);
  };

  /**
   * Executes a PUT request to submit edits to a source.
   *
   * @param {SourceType} payload - The payload containing information about the source to be updated.
   * @returns {AxiosResponse} - The Axios response object representing the result of the request.
   */
  const submitEditedSource = (payload: SourceType) => {
    return axios.put(`${process.env.REACT_APP_SOURCES_SERVICE}${payload.id}/`, payload);
  };

  /**
   * Executes a DELETE request to delete a source.
   *
   * @param {SourceType} [source] - (Optional) The source to be deleted. If not provided, it uses `pendingDeleteSource`.
   * @returns {AxiosResponse} - The Axios response object representing the result of the request.
   */
  const deleteSource = (source?: SourceType) => {
    return axios.delete(
      `${process.env.REACT_APP_SOURCES_SERVICE}${(source || pendingDeleteSource)?.id}/`
    );
  };

  /**
   * Executes a GET request to retrieve connection information related to a source.
   *
   * @param {SourceType} source - The source to which connections are related.
   * @returns {AxiosResponse} - The Axios response object representing the result of the request.
   */
  const showConnections = (source: SourceType) => {
    return axios.get(
      `${process.env.REACT_APP_SCAN_JOBS_SERVICE}${source.connection.id}/connection/?page=1&page_size=1000&ordering=name&source_type=${source.id}`
    );
  };

  /**
   * Sets the source that is currently being edited.
   *
   * @param {SourceType} source - The source to be set as the one being edited.
   */
  const onEditSource = (source: SourceType) => {
    setSourceBeingEdited(source);
  };

  /**
   * Deletes several selected sources based on user interaction.
   * Add your logic to handle the deletion of selected items within this function.
   */
  const onDeleteSelectedSources = () => {
    const selectedItems = [];
    console.log('Deleting selected sources:', selectedItems);
  };

  /**
   * Closes the connections view by resetting selected connections and clearing connection data.
   */
  const onCloseConnections = () => {
    setConnectionsSelected(undefined);
    setConnectionsData(emptyConnectionData);
  };

  /**
   * Sets the selected sources for scanning.
   *
   * @param {SourceType[]} items - An array of source items to be selected for scanning.
   */
  const onScanSources = items => {
    setScanSelected(items);
  };

  /**
   * Sets a single source for scanning as the selected source.
   *
   * @param {SourceType} source - The source to be selected for scanning.
   */
  const onScanSource = (source: SourceType) => {
    setScanSelected([source]);
  };

  return {
    runScan,
    addSource,
    submitEditedSource,
    deleteSource,
    showConnections,
    onEditSource,
    onScanSources,
    scanSelected,
    setScanSelected,
    onDeleteSelectedSources,
    onCloseConnections,
    onScanSource,
    addSourceModal,
    setAddSourceModal,
    sourceBeingEdited,
    setSourceBeingEdited,
    pendingDeleteSource,
    setConnectionsData,
    setPendingDeleteSource,
    connectionsData,
    connectionsSelected,
    setConnectionsSelected
  };
};

export default useSourceApi;
