import React from 'react';

const StatsCard = ({ icon: Icon, title, value, trend, color }) => {
  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-100',
      icon: 'text-blue-500'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-100',
      icon: 'text-green-500'
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-100',
      icon: 'text-purple-500'
    },
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-100',
      icon: 'text-orange-500'
    },
    red: {
      border: 'border-red-500',
      bg: 'bg-red-100',
      icon: 'text-red-500'
    },
    yellow: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-100',
      icon: 'text-yellow-500'
    },
    cyan: {
      border: 'border-cyan-500',
      bg: 'bg-cyan-100',
      icon: 'text-cyan-500'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${colors.border}`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-full p-3 ${colors.bg}`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;