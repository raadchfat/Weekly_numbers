import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { useDataProcessor } from './hooks/useDataProcessor';
import { getCurrentWeek } from './utils/dateUtils';

function App() {
  const [selectedTechnician, setSelectedTechnician] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  
  const {
    data,
    loading,
    error,
    technicians,
    availableWeeks,
    processFiles,
    clearData
  } = useDataProcessor();

  const handleFilesSelected = async (opportunitiesFile, lineItemsFile) => {
    try {
      await processFiles(opportunitiesFile, lineItemsFile);
    } catch (err) {
      console.error('Error processing files:', err);
    }
  };

  const handleRefresh = () => {
    clearData();
    setSelectedTechnician('all');
    setSelectedWeek(getCurrentWeek());
  };

  const handleTechnicianChange = (technician) => {
    setSelectedTechnician(technician);
  };

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
  };

  // Show file upload if no data is loaded
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FileUpload 
          onFilesSelected={handleFilesSelected}
          loading={loading}
        />
        
        {error && (
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Processing Files
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show dashboard if data is loaded
  return (
    <Dashboard
      data={data}
      technicians={technicians}
      availableWeeks={availableWeeks}
      selectedTechnician={selectedTechnician}
      selectedWeek={selectedWeek}
      onTechnicianChange={handleTechnicianChange}
      onWeekChange={handleWeekChange}
      onRefresh={handleRefresh}
    />
  );
}

export default App; 