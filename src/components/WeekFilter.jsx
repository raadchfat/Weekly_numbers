import React from 'react';
import { Calendar } from 'lucide-react';
import { getWeekRange } from '../utils/dateUtils';

const WeekFilter = ({ availableWeeks, selectedWeek, onWeekChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-5 w-5 text-gray-500" />
      <label htmlFor="week-select" className="text-sm font-medium text-gray-700">
        Week:
      </label>
      <select
        id="week-select"
        value={selectedWeek}
        onChange={(e) => onWeekChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
      >
        {availableWeeks.map((week) => (
          <option key={week} value={week}>
            {getWeekRange(week)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WeekFilter; 