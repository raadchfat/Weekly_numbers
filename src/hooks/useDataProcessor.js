import { useState, useCallback } from 'react';
import { parseExcelFile, mergeData, validateData } from '../utils/excelParser';
import { getAvailableWeeks } from '../utils/dateUtils';
import { getTechnicians } from '../utils/kpiCalculations';

export const useDataProcessor = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [availableWeeks, setAvailableWeeks] = useState([]);

  const processFiles = useCallback(async (opportunitiesFile, lineItemsFile) => {
    setLoading(true);
    setError(null);

    try {
      // Parse both Excel files
      const [opportunitiesData, lineItemsData] = await Promise.all([
        parseExcelFile(opportunitiesFile),
        parseExcelFile(lineItemsFile)
      ]);

      // Validate data structure
      if (!validateData(opportunitiesData, 'opportunities')) {
        throw new Error('Invalid opportunities file format. Please check the file structure.');
      }

      if (!validateData(lineItemsData, 'lineItems')) {
        throw new Error('Invalid line items file format. Please check the file structure.');
      }

      // Merge the data
      const mergedData = mergeData(opportunitiesData, lineItemsData);

      // Extract available technicians and weeks
      const techs = getTechnicians(mergedData);
      const weeks = getAvailableWeeks(mergedData);

      setData(mergedData);
      setTechnicians(techs);
      setAvailableWeeks(weeks);

      return mergedData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setTechnicians([]);
    setAvailableWeeks([]);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    technicians,
    availableWeeks,
    processFiles,
    clearData
  };
}; 