import React from 'react';
import { User } from 'lucide-react';

const TechnicianFilter = ({ technicians, selectedTechnician, onTechnicianChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <User className="h-5 w-5 text-gray-500" />
      <label htmlFor="technician-select" className="text-sm font-medium text-gray-700">
        Technician:
      </label>
      <select
        id="technician-select"
        value={selectedTechnician}
        onChange={(e) => onTechnicianChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
      >
        <option value="all">All Technicians</option>
        {technicians.map((technician) => (
          <option key={technician} value={technician}>
            {technician}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TechnicianFilter; 