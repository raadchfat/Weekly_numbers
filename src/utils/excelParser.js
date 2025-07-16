import * as XLSX from 'xlsx';

/**
 * Parse Excel file and convert to JSON
 * @param {File} file - Excel file to parse
 * @returns {Promise<Array>} Parsed data as JSON array
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Process and merge opportunities and line items data
 * @param {Array} opportunitiesData - Opportunities report data
 * @param {Array} lineItemsData - Line items sold report data
 * @returns {Array} Merged dataset
 */
export const mergeData = (opportunitiesData, lineItemsData) => {
  if (!opportunitiesData || !lineItemsData) {
    throw new Error('Both opportunities and line items data are required');
  }

  // Create a map of line items by Job ID
  const lineItemsMap = new Map();
  lineItemsData.forEach(item => {
    const jobId = item['Job (ID)'] || item['Job ID'] || item['Job'];
    if (jobId) {
      if (!lineItemsMap.has(jobId)) {
        lineItemsMap.set(jobId, []);
      }
      lineItemsMap.get(jobId).push(item);
    }
  });

  // Merge opportunities with line items
  const mergedData = opportunitiesData.map(opportunity => {
    const jobId = opportunity['Job (ID)'] || opportunity['Job ID'] || opportunity['Job'];
    const lineItems = lineItemsMap.get(jobId) || [];
    
    return {
      ...opportunity,
      lineItems,
      // Normalize field names
      date: opportunity['Date'] || opportunity['date'],
      jobId: jobId,
      customer: opportunity['Customer'] || opportunity['customer'],
      opportunityOwner: opportunity['Opportunity Owner'] || opportunity['Opportunity Owner (technician)'] || opportunity['opportunityOwner'],
      status: opportunity['Status'] || opportunity['status'],
      revenue: parseFloat(opportunity['Revenue'] || opportunity['revenue'] || 0),
      membershipOpportunity: opportunity['Membership Opportunity'] || opportunity['membershipOpportunity'],
      membershipSold: opportunity['Membership Sold'] || opportunity['membershipSold']
    };
  });

  return mergedData;
};

/**
 * Validate data structure
 * @param {Array} data - Data to validate
 * @param {string} type - Type of data ('opportunities' or 'lineItems')
 * @returns {boolean} Validation result
 */
export const validateData = (data, type) => {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  const requiredFields = type === 'opportunities' 
    ? ['Date', 'Job (ID)', 'Customer', 'Opportunity Owner', 'Status', 'Revenue']
    : ['Job (ID)', 'Opp. Owner', 'Category', 'Line Item', 'Price'];

  const firstRow = data[0];
  const hasRequiredFields = requiredFields.some(field => 
    firstRow.hasOwnProperty(field) || 
    firstRow.hasOwnProperty(field.replace(/[()]/g, '')) ||
    firstRow.hasOwnProperty(field.toLowerCase())
  );

  return hasRequiredFields;
}; 