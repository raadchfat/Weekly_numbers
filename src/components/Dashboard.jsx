import React, { useMemo } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import KPICard from './KPICard';
import TechnicianFilter from './TechnicianFilter';
import WeekFilter from './WeekFilter';
import RevenueChart from './Charts/RevenueChart';
import JobStatusChart from './Charts/JobStatusChart';
import { getWeekNumber } from '../utils/dateUtils';

const Dashboard = ({ 
  data, 
  technicians, 
  availableWeeks, 
  selectedTechnician, 
  selectedWeek, 
  onTechnicianChange, 
  onWeekChange,
  onRefresh 
}) => {
  // Calculate KPIs for the selected technician and week
  const kpis = useMemo(() => {
    if (!data || !selectedWeek) {
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
    let filteredJobs = data.filter(job => {
      const jobWeek = getWeekNumber(job.date);
      const matchesTechnician = selectedTechnician === 'all' || job.opportunityOwner === selectedTechnician;
      const matchesWeek = jobWeek === selectedWeek;
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
    const countServiceJobs = (jobs, serviceType) => {
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
  }, [data, selectedTechnician, selectedWeek]);

  // Prepare chart data
  const revenueChartData = useMemo(() => {
    if (!data || !availableWeeks) return [];

    return availableWeeks.map(week => {
      const weekJobs = data.filter(job => {
        const jobWeek = getWeekNumber(job.date);
        const matchesTechnician = selectedTechnician === 'all' || job.opportunityOwner === selectedTechnician;
        const matchesWeek = jobWeek === week;
        return matchesTechnician && matchesWeek;
      });

      const wonJobs = weekJobs.filter(job => 
        job.status && job.status.toLowerCase() === 'won'
      );

      const revenue = wonJobs.reduce((sum, job) => sum + (job.revenue || 0), 0);

      return {
        week: week.split('-W')[1], // Extract week number
        revenue: Math.round(revenue * 100) / 100
      };
    });
  }, [data, selectedTechnician, availableWeeks]);

  const jobStatusData = useMemo(() => {
    if (!data || !selectedWeek) return [];

    let filteredJobs = data.filter(job => {
      const jobWeek = getWeekNumber(job.date);
      const matchesTechnician = selectedTechnician === 'all' || job.opportunityOwner === selectedTechnician;
      const matchesWeek = jobWeek === selectedWeek;
      return matchesTechnician && matchesWeek;
    });

    // Filter out invalid jobs
    filteredJobs = filteredJobs.filter(job => 
      job.status && job.status.toLowerCase() !== 'invalid'
    );

    const statusCounts = {};
    filteredJobs.forEach(job => {
      const status = job.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [data, selectedTechnician, selectedWeek]);

  const exportData = () => {
    const exportObj = {
      technician: selectedTechnician,
      week: selectedWeek,
      kpis,
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `omaha-drain-kpis-${selectedTechnician}-${selectedWeek}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KPI Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Weekly performance metrics for Omaha Drain service technicians
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button
              onClick={onRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            
            <button
              onClick={exportData}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <TechnicianFilter
              technicians={technicians}
              selectedTechnician={selectedTechnician}
              onTechnicianChange={onTechnicianChange}
            />
            
            <WeekFilter
              availableWeeks={availableWeeks}
              selectedWeek={selectedWeek}
              onWeekChange={onWeekChange}
            />
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Average Ticket Value"
            value={kpis.avgTicketValue}
            type="currency"
            subtitle={`${kpis.wonJobs} won jobs`}
          />
          
          <KPICard
            title="Job Close Rate"
            value={kpis.jobCloseRate}
            type="percentage"
            subtitle={`${kpis.wonJobs} of ${kpis.totalJobs} jobs`}
          />
          
          <KPICard
            title="Weekly Revenue"
            value={kpis.weeklyRevenue}
            type="currency"
            subtitle="Total revenue this week"
          />
          
          <KPICard
            title="Membership Win Rate"
            value={kpis.membershipWinRate}
            type="percentage"
            subtitle={`${kpis.membershipsSold} of ${kpis.membershipOpportunities} opportunities`}
          />
          
          <KPICard
            title="Hydro Jetting Jobs"
            value={kpis.hydroJettingJobs}
            type="number"
            subtitle="Jobs sold this week"
          />
          
          <KPICard
            title="Descaling Jobs"
            value={kpis.descalingJobs}
            type="number"
            subtitle="Jobs sold this week"
          />
          
          <KPICard
            title="Water Heater Jobs"
            value={kpis.waterHeaterJobs}
            type="number"
            subtitle="Jobs sold this week"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart 
            data={revenueChartData} 
            selectedTechnician={selectedTechnician}
          />
          
          <JobStatusChart 
            data={jobStatusData} 
            selectedTechnician={selectedTechnician}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 