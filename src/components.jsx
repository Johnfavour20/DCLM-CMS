import React, { useState } from 'react';
import {
  Info, Check, AlertTriangle, X, Upload, Plus, DollarSign, Target, UserPlus,
  Users, BarChart3, TrendingUp, Calendar, Building2
} from 'lucide-react';

// Recharts for charts
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Toast = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-gray-800';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 mr-2" />;
      case 'error':
        return <X className="w-5 h-5 mr-2" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 mr-2" />;
      default:
        return <Info className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-[100] p-4 rounded-md shadow-lg flex items-center transition-opacity duration-300 ${getColors()}`} role="alert">
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto text-current opacity-75 hover:opacity-100 focus:outline-none">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Modal = ({ show, title, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 mx-4">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const FileUpload = ({ label, onFileChange }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName('');
      onFileChange(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#4680C2] hover:text-[#3b6da6] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#4680C2]">
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
          {fileName && <p className="text-sm font-medium text-gray-900 mt-2">{fileName}</p>}
        </div>
      </div>
    </div>
  );
};

export const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: color, opacity: 0.2 }}>
        <Icon className="w-6 h-6" style={{ color: color }} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export const SimpleChart = ({ data, dataKey, chartType }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-md">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartColor = "#4680C2"; // Consistent chart color

  return (
    <ResponsiveContainer width="100%" height={300}>
      {chartType === 'line' ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke={chartColor} strokeWidth={2} />
        </LineChart>
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="offering_type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill={chartColor} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};   