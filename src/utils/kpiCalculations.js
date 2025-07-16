import { getWeekNumber } from './dateUtils';

/**
 * Count service jobs by type
 * @param {Array} jobs - Array of job data
 * @param {string} serviceType - Service type to search for
 * @returns {number} Count of jobs with specified service
 */
export const countServiceJobs = (jobs, serviceType) => {
  if (!Array.isArray(jobs) || jobs.length === 0) return 0;
  
  return jobs.filter(job => {
    if (!job.lineItems || !Array.isArray(job.lineItems)) return false;
    
    return job.lineItems.some(item => {
      const category = (item['Category'] || item['category'] || '').toLowerCase();
      const lineItem = (item['Line Item'] || item['lineItem'] || '').toLowerCase();
      const searchTerm = serviceType.toLowerCase();
      
      return category.includes(searchTerm) || lineItem.includes(searchTerm);
    });
  }).length;
};

/**
 * Calculate all KPIs for a given technician and week
 * @param {Array} jobs - All job data
 * @param {string} technician - Technician name (or 'all' for all technicians)
 * @param {string} week - Week identifier
 * @returns {Object} KPI calculations
 */
export const calculateKPIs = (jobs, technician, week) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return {
      avgTicketValue: 0,
      jobCloseRate: 0,
      weeklyRevenue: 0,
      membershipWinRate: 0,
      hydroJettingJobs: 0,
      descalingJobs: 0,
      waterHeaterJobs: 0,
      totalJobs: 0,
      wonJobs: 0,
      membershipOpportunities: 0,
      membershipsSold: 0
    };
  }

  // Filter jobs by technician and week
  let filteredJobs = jobs.filter(job => {
    const jobWeek = getWeekNumber(job.date);
    const matchesTechnician = technician === 'all' || job.opportunityOwner === technician;
    const matchesWeek = jobWeek === week;
    return matchesTechnician && matchesWeek;
  });

  // Filter out invalid jobs
  filteredJobs = filteredJobs.filter(job => 
    job.status && job.status.toLowerCase() !== 'invalid'
  );

  const wonJobs = filteredJobs.filter(job => 
    job.status && job.status.toLowerCase() === 'won'
  );

  // Calculate basic metrics
  const totalJobs = filteredJobs.length;
  const wonJobsCount = wonJobs.length;
  const totalRevenue = wonJobs.reduce((sum, job) => sum + (job.revenue || 0), 0);
  
  // Calculate membership metrics
  const membershipOpportunities = filteredJobs.filter(job => 
    job.membershipOpportunity && job.membershipOpportunity.toString().toLowerCase() === 'true'
  ).length;
  
  const membershipsSold = filteredJobs.filter(job => 
    job.membershipSold && job.membershipSold.toString().toLowerCase() === 'true'
  ).length;

  // Calculate KPIs
  const avgTicketValue = wonJobsCount > 0 ? totalRevenue / wonJobsCount : 0;
  const jobCloseRate = totalJobs > 0 ? (wonJobsCount / totalJobs) * 100 : 0;
  const membershipWinRate = membershipOpportunities > 0 ? (membershipsSold / membershipOpportunities) * 100 : 0;

  // Calculate service-specific jobs
  const hydroJettingJobs = countServiceJobs(wonJobs, 'jetting') + countServiceJobs(wonJobs, 'hydro');
  const descalingJobs = countServiceJobs(wonJobs, 'descal');
  const waterHeaterJobs = countServiceJobs(wonJobs, 'water heater');

  return {
    avgTicketValue: Math.round(avgTicketValue * 100) / 100,
    jobCloseRate: Math.round(jobCloseRate * 100) / 100,
    weeklyRevenue: Math.round(totalRevenue * 100) / 100,
    membershipWinRate: Math.round(membershipWinRate * 100) / 100,
    hydroJettingJobs,
    descalingJobs,
    waterHeaterJobs,
    totalJobs,
    wonJobs: wonJobsCount,
    membershipOpportunities,
    membershipsSold
  };
};

/**
 * Get all unique technicians from data
 * @param {Array} jobs - Job data
 * @returns {Array} Array of technician names
 */
export const getTechnicians = (jobs) => {
  if (!Array.isArray(jobs) || jobs.length === 0) return [];
  
  const technicians = [...new Set(
    jobs
      .map(job => job.opportunityOwner)
      .filter(Boolean)
  )];
  
  return technicians.sort();
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 * @param {number} percentage - Percentage to format
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (percentage) => {
  return `${Math.round(percentage)}%`;
}; 