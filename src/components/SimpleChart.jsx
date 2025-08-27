import React from 'react';

const SimpleChart = ({ data, dataKey }) => {
  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Chart Placeholder for "{dataKey}"</p>
    </div>
  );
};

export default SimpleChart;