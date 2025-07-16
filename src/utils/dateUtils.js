/**
 * Get week number from date string
 * @param {string} dateString - Date string in any format
 * @returns {string} Week identifier in format "YYYY-WXX"
 */
export const getWeekNumber = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }
  
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
};

/**
 * Get current week number
 * @returns {string} Current week identifier
 */
export const getCurrentWeek = () => {
  return getWeekNumber(new Date());
};

/**
 * Get week range for display
 * @param {string} weekId - Week identifier
 * @returns {string} Formatted week range
 */
export const getWeekRange = (weekId) => {
  if (!weekId) return '';
  
  const [year, week] = weekId.split('-W');
  const startOfYear = new Date(parseInt(year), 0, 1);
  const startOfWeek = new Date(startOfYear);
  startOfWeek.setDate(startOfYear.getDate() + (parseInt(week) - 1) * 7 - startOfYear.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
};

/**
 * Get all available weeks from data
 * @param {Array} data - Array of job data
 * @returns {Array} Array of week identifiers
 */
export const getAvailableWeeks = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  const weeks = [...new Set(data.map(job => getWeekNumber(job.date)).filter(Boolean))];
  return weeks.sort();
}; 