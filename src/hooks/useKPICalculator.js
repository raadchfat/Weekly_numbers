import { useMemo } from 'react';
import { calculateKPIs } from '../utils/kpiCalculations';

export const useKPICalculator = (data, selectedTechnician, selectedWeek) => {
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

    return calculateKPIs(data, selectedTechnician, selectedWeek);
  }, [data, selectedTechnician, selectedWeek]);

  return kpis;
}; 