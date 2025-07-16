import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

const FileUpload = ({ onFilesSelected, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [opportunitiesFile, setOpportunitiesFile] = useState(null);
  const [lineItemsFile, setLineItemsFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const excelFiles = files.filter(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );

    if (excelFiles.length !== 2) {
      alert('Please select exactly 2 Excel files: Opportunities Report and Line Items Sold Report');
      return;
    }

    // Try to identify which file is which based on filename
    let oppFile = null;
    let lineFile = null;

    excelFiles.forEach(file => {
      const fileName = file.name.toLowerCase();
      if (fileName.includes('opportunity') || fileName.includes('opp')) {
        oppFile = file;
      } else if (fileName.includes('line') || fileName.includes('item')) {
        lineFile = file;
      }
    });

    // If we can't identify by name, use the first two files
    if (!oppFile || !lineFile) {
      [oppFile, lineFile] = excelFiles;
    }

    setOpportunitiesFile(oppFile);
    setLineItemsFile(lineFile);
    onFilesSelected(oppFile, lineFile);
  };

  const removeFile = (type) => {
    if (type === 'opportunities') {
      setOpportunitiesFile(null);
    } else {
      setLineItemsFile(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Omaha Drain KPI Dashboard
        </h1>
        <p className="text-gray-600">
          Upload your Opportunities Report and Line Items Sold Report to view weekly KPIs
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="hidden"
        />

        {!opportunitiesFile && !lineItemsFile ? (
          <div>
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Upload Excel Files
            </p>
            <p className="text-gray-600 mb-4">
              Drag and drop your Opportunities Report and Line Items Sold Report here, or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-primary hover:text-primary-dark font-medium"
              >
                browse files
              </button>
            </p>
            <div className="text-sm text-gray-500">
              <p>Required files:</p>
              <ul className="mt-1 space-y-1">
                <li>• Opportunities Report (.xlsx)</li>
                <li>• Line Items Sold Report (.xlsx)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Selected Files:</h3>
            
            {opportunitiesFile && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    {opportunitiesFile.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile('opportunities')}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {lineItemsFile && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    {lineItemsFile.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile('lineItems')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {loading && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Processing files...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 