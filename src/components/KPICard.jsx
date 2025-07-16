import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/kpiCalculations';

const KPICard = ({ title, value, subtitle, type = 'number', trend, className = '' }) => {
  const formatValue = () => {
    if (type === 'currency') {
      return formatCurrency(value);
    } else if (type === 'percentage') {
      return formatPercentage(value);
    } else {
      return value.toLocaleString();
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    return trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-gray-500';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return '↗';
    if (trend < 0) return '↘';
    return '→';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {trend && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()} {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      <div className="flex items-baseline">
        <p className="text-3xl font-bold text-gray-900">
          {formatValue()}
        </p>
      </div>
      
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default KPICard; 