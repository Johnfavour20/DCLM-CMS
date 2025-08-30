import React, { useState, useEffect } from 'react';
import {
  User, Eye, EyeOff, Shield, Users, BarChart3, DollarSign, Target, UserPlus,
  LogOut, Menu, Bell, Download, Clock, Calendar, TrendingUp, Building2,
  FileText, Plus, Search, Edit, Trash2, CreditCard, Upload, X
} from 'lucide-react';

// Helper functions for formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Toast Component
const Toast = ({ show, message, type, onClose }) => {
  if (!show) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{title}</h3>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center">
      <div className={`p-3 rounded-full`} style={{ backgroundColor: '#1e40af' + '20' }}>
        <Icon className="w-6 h-6" style={{ color: '#1e40af' }} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// File Upload Component
const FileUpload = ({ onFileSelect, accept = "image/*,application/pdf", label = "Upload Receipt" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        file: file,
        data: e.target.result,
        name: file.name
      };
      setPreviewData(fileData);
      onFileSelect(fileData);
    };
    reader.readAsDataURL(file);
  };

  const renderPreview = () => {
    if (!previewData) return null;
    
    const isImage = previewData.file.type.startsWith('image/');
    const isPdf = previewData.file.type === 'application/pdf';
    
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Preview</h4>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
        
        {showPreview && (
          <div className="mt-2">
            {isImage && (
              <img
                src={previewData.data}
                alt="Preview"
                className="max-w-full h-48 object-contain rounded border"
              />
            )}
            {isPdf && (
              <div className="flex items-center justify-center h-48 bg-gray-200 rounded border">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">PDF Preview</p>
                  <p className="text-xs text-gray-500">{previewData.name}</p>
                </div>
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>File: {previewData.name}</p>
              <p>Size: {(previewData.file.size / 1024).toFixed(1)} KB</p>
              <p>Type: {previewData.file.type}</p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {selectedFile ? selectedFile.name : 'Drag and drop a file here, or click to select'}
        </p>
        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
      </div>
      {renderPreview()}
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [token, setToken] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendanceData, setAttendanceData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [accountDetails, setAccountDetails] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Form states
  const [attendanceForm, setAttendanceForm] = useState({
    service_date: '',
    men: 0,
    women: 0,
    youth_boys: 0,
    youth_girls: 0,
    children_boys: 0,
    children_girls: 0,
    new_converts: 0,
    youtube: 0,
  });

  const [paymentForm, setPaymentForm] = useState({
    date: '',
    payment_type: 'tithe',
    amount: '',
    description: '',
    account_details: '',
    receipt_data: null,
    receipt_filename: null
  });

  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    role: 'secretary',
    full_name: '',
    phone_number: '',
    email: '',
    gender: 'male'
  });

  const [projectForm, setProjectForm] = useState({
    project_name: '',
    target_amount: '',
    start_date: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      if (currentUser?.role === 'secretary' || currentUser?.role === 'group_admin' || currentUser?.role === 'regional_admin') {
        fetchAttendanceData();
      }
      if (currentUser?.role === 'accountant' || currentUser?.role === 'group_admin' || currentUser?.role === 'regional_admin') {
        fetchPaymentData();
        fetchAccountDetails();
      }
      if (currentUser?.role === 'regional_admin') {
        fetchProjectsData();
        fetchUsersData();
      }
      if (currentUser?.role === 'group_admin' || currentUser?.role === 'regional_admin') {
        fetchUsersData();
      }
    }
  }, [token, currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        setToken(data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        showToast('Login successful!');
      } else {
        setLoginMessage(data.message || 'Login failed.');
        showToast(data.message || 'Login failed.', 'error');
      }
    } catch (error) {
      setLoginMessage('Network error. Please try again.');
      showToast('Network error. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setActiveTab('dashboard');
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch('/api/attendance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.attendances);
      } else {
        showToast('Failed to fetch attendance data.', 'error');
      }
    } catch (error) {
      showToast('Network error fetching attendance data.', 'error');
    }
  };

  const fetchPaymentData = async () => {
    try {
      const response = await fetch('/api/payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPaymentData(data.payments);
      } else {
        showToast('Failed to fetch payment data.', 'error');
      }
    } catch (error) {
      showToast('Network error fetching payment data.', 'error');
    }
  };

  const fetchAccountDetails = async () => {
    try {
      const response = await fetch('/api/account-details', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAccountDetails(data.accounts);
      } else {
        showToast('Failed to fetch account details.', 'error');
      }
    } catch (error) {
      showToast('Network error fetching account details.', 'error');
    }
  };

  const fetchProjectsData = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProjectsData(data.projects);
      } else {
        showToast('Failed to fetch projects data.', 'error');
      }
    } catch (error) {
      showToast('Network error fetching projects data.', 'error');
    }
  };

  const fetchUsersData = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsersData(data.users);
      } else {
        showToast('Failed to fetch users data.', 'error');
      }
    } catch (error) {
      showToast('Network error fetching users data.', 'error');
    }
  };

  const handleFormSubmit = async (endpoint, formData, successMessage) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        showToast(successMessage);
        setActiveModal(null);
        // Reset forms and refresh data
        if (endpoint.includes('attendance')) {
          setAttendanceForm({
            service_date: '',
            men: 0,
            women: 0,
            youth_boys: 0,
            youth_girls: 0,
            children_boys: 0,
            children_girls: 0,
            new_converts: 0,
            youtube: 0,
          });
          fetchAttendanceData();
        }
        if (endpoint.includes('payments')) {
          setPaymentForm({ date: '', payment_type: 'tithe', amount: '', description: '', account_details: '', receipt_data: null, receipt_filename: null });
          fetchPaymentData();
        }
        if (endpoint.includes('projects')) {
          setProjectForm({ project_name: '', target_amount: '', start_date: '' });
          fetchProjectsData();
        }
        if (endpoint.includes('users')) {
          setUserForm({ username: '', password: '', role: 'secretary', full_name: '', phone_number: '', email: '', gender: 'male' });
          fetchUsersData();
        }
      } else {
        showToast(data.error || data.message || 'An error occurred.', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  // Handler for attendance form submission
  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    const youth_total = parseInt(attendanceForm.youth_boys) + parseInt(attendanceForm.youth_girls);
    const children_total = parseInt(attendanceForm.children_boys) + parseInt(attendanceForm.children_girls);
    const total_headcount = parseInt(attendanceForm.men) + parseInt(attendanceForm.women) + youth_total + children_total;
    const submissionData = { ...attendanceForm, total_headcount };
    handleFormSubmit('/api/attendance/submit', submissionData, 'Attendance recorded successfully!');
  };

  // Handler for payment form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('/api/payments', paymentForm, 'Payment recorded successfully!');
  };

  // Handler for user form submission
  const handleUserSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('/api/users', userForm, 'User created successfully!');
  };

  // Handler for project form submission
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('/api/projects', projectForm, 'Project created successfully!');
  };

  // Download PDF handlers
  const downloadAttendancePDF = async () => {
    try {
      const response = await fetch('/api/attendance/pdf', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'attendance_records.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showToast('Attendance records downloaded successfully!');
      } else {
        showToast('Failed to download attendance records.', 'error');
      }
    } catch (error) {
      showToast('Error downloading attendance records.', 'error');
    }
  };

  const downloadPaymentsPDF = async () => {
    try {
      const response = await fetch('/api/payments/pdf', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'payment_records.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showToast('Payment records downloaded successfully!');
      } else {
        showToast('Failed to download payment records.', 'error');
      }
    } catch (error) {
      showToast('Error downloading payment records.', 'error');
    }
  };

  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-[#1e40af] text-white flex flex-col`}>
      <div className="flex items-center justify-center h-16 bg-[#1e3a8a] border-b border-[#3b82f6]">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
          <div className="w-8 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-6 bg-white rounded-sm"></div>
              <div className="absolute w-6 h-1 bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold">DCLM CMS</span>
          <p className="text-xs opacity-75">Achieving Heaven's Goal</p>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <button onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'dashboard' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-[#3b82f6]'}`}>
          <BarChart3 className="w-5 h-5 mr-3" />
          Dashboard
        </button>
        {(currentUser?.role === 'secretary' || currentUser?.role === 'group_admin' || currentUser?.role === 'regional_admin') && (
          <button onClick={() => { setActiveTab('attendance'); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'attendance' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-[#3b82f6]'}`}>
            <Users className="w-5 h-5 mr-3" />
            Attendance
          </button>
        )}
        {(currentUser?.role === 'accountant' || currentUser?.role === 'group_admin' || currentUser?.role === 'regional_admin') && (
          <>
            <button onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'payments' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-[#3b82f6]'}`}>
              <DollarSign className="w-5 h-5 mr-3" />
              Payments
            </button>
            <button onClick={() => { setActiveTab('accounts'); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'accounts' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-[#3b82f6]'}`}>
              <CreditCard className="w-5 h-5 mr-3" />
              Account Details
            </button>
          </>
        )}
        {(currentUser?.role === 'group_admin' || currentUser?.role === 'regional_admin') && (
          <button onClick={() => { setActiveTab('members'); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'members' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-[#3b82f6]'}`}>
            <Users className="w-5 h-5 mr-3" />
            Members
          </button>
        )}
        {(currentUser?.role === 'regional_admin') && (
          <>
            <button onClick={() => { setActiveTab('users'); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'users' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-[#3b82f6]'}`}>
              <UserPlus className="w-5 h-5 mr-3" />
              User Management
            </button>
            <button onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'projects' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-[#3b82f6]'}`}>
              <Target className="w-5 h-5 mr-3" />
              Projects
            </button>
          </>
        )}
      </nav>
      <div className="mt-auto p-4 border-t border-[#3b82f6]">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white mr-3">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{currentUser?.username}</h3>
            <p className="text-sm opacity-75 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-200 hover:text-white transition-colors duration-200">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderHeader = (title, showActions = true) => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {showActions && (
        <div className="flex items-center space-x-2">
          {(currentUser?.role === 'secretary' || currentUser?.role === 'group_admin' || currentUser?.role === 'regional_admin') && activeTab === 'attendance' && (
            <>
              <button onClick={downloadAttendancePDF} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200">
                <Download className="w-5 h-5 inline-block mr-1" /> Download PDF
              </button>
              <button onClick={() => setActiveModal('Record Attendance')} className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors duration-200">
                <Plus className="w-5 h-5 inline-block mr-1" /> Record
              </button>
            </>
          )}
          {(currentUser?.role === 'accountant' || currentUser?.role === 'group_admin' || currentUser?.role === 'regional_admin') && activeTab === 'payments' && (
            <>
              <button onClick={downloadPaymentsPDF} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200">
                <Download className="w-5 h-5 inline-block mr-1" /> Download PDF
              </button>
              <button onClick={() => setActiveModal('Record Payment')} className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors duration-200">
                <Plus className="w-5 h-5 inline-block mr-1" /> New Payment
              </button>
            </>
          )}
          {(currentUser?.role === 'regional_admin' && activeTab === 'users') && (
            <button onClick={() => setActiveModal('Add User')} className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors duration-200">
              <Plus className="w-5 h-5 inline-block mr-1" /> Add User
            </button>
          )}
          {(currentUser?.role === 'regional_admin' && activeTab === 'projects') && (
            <button onClick={() => setActiveModal('Add Project')} className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors duration-200">
              <Plus className="w-5 h-5 inline-block mr-1" /> Add Project
            </button>
          )}
        </div>
      )}
    </div>
  );
  
  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Members" value={usersData.length || "0"} icon={Users} color="#1e40af" />
        <StatsCard title="Last Sunday Attendance" value={attendanceData[0]?.total_headcount || "0"} icon={Calendar} color="#1e40af" />
        <StatsCard title="Total Payments" value={paymentData.length || "0"} icon={DollarSign} color="#1e40af" />
        <StatsCard title="Active Projects" value={projectsData.filter(p => p.status === 'active').length || "0"} icon={Building2} color="#1e40af" />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Attendance</h3>
          <div className="space-y-2">
            {attendanceData.slice(0, 5).map(record => (
              <div key={record.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{formatDate(record.service_date)}</span>
                <span className="font-semibold">{record.total_headcount} people</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Payments</h3>
          <div className="space-y-2">
            {paymentData.slice(0, 5).map(payment => (
              <div key={payment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="text-sm text-gray-600">{formatDate(payment.date)}</span>
                  <p className="text-xs text-gray-500 capitalize">{payment.payment_type}</p>
                </div>
                <span className="font-semibold">{formatCurrency(payment.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderAttendance = () => (
    <>
      {renderHeader('Attendance Records')}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Men</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Women</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Youth (Boys)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Youth (Girls)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Children (Boys)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Children (Girls)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YouTube</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.service_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.men}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.women}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.youth_boys}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.youth_girls}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.children_boys}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.children_girls}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.youtube}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{record.total_headcount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderPayments = () => (
    <>
      {renderHeader('Payment Records')}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentData.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{record.payment_type.replace('_', ' ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(record.amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.description || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.receipt_path ? (
                    <button 
                      onClick={() => setActiveModal(`preview-${record.id}`)}
                      className="text-[#4680C2] hover:text-[#3b6da6]"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderAccountDetails = () => (
    <>
      {renderHeader('Church Account Details', false)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accountDetails.map((account) => (
          <div key={account.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">{account.account_type.replace('_', ' ')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">{account.account_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-medium">{account.account_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="font-medium">{account.bank_name}</span>
              </div>
              {account.sort_code && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sort Code:</span>
                  <span className="font-medium">{account.sort_code}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderMembers = () => (
    <>
      {renderHeader('Member Details', false)}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersData.filter(user => user.role !== 'regional_admin').map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.full_name || user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.gender || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone_number || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderProjects = () => (
    <>
      {renderHeader('Projects')}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projectsData.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.project_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(project.target_amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(project.current_amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(project.start_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
  
  const renderUsers = () => (
    <>
      {renderHeader('User Management')}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersData.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.full_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone_number || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.username !== currentUser.username && (
                    <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative">
                <div className="w-8 h-10 bg-white rounded-sm relative">
                  <div className="absolute w-10 h-2 bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#1e40af] mb-2">DCLM CMS</h2>
              <p className="text-gray-600 text-sm mb-1">Deeper Christian Life Ministry</p>
              <p className="text-gray-500 text-xs italic">Achieving Heaven's Goal</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {loginMessage && (
                <p className="text-sm text-red-600 text-center">{loginMessage}</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#1e40af] text-white py-2 px-4 rounded-md hover:bg-[#1e3a8a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:ring-offset-2"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'attendance': return renderAttendance();
      case 'payments': return renderPayments();
      case 'accounts': return renderAccountDetails();
      case 'members': return renderMembers();
      case 'users': return renderUsers();
      case 'projects': return renderProjects();
      default: return renderDashboard();
    }
  };

  return (
    <div className="App">
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
      {isLoggedIn ? (
        <div className="flex min-h-screen bg-gray-100">
          {renderSidebar()}
          <div className="flex-1 flex flex-col">
            <header className="flex-shrink-0 bg-white shadow-md p-4 flex justify-between items-center lg:hidden">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none focus:text-gray-900">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Church CMS</h1>
              <div className="flex items-center space-x-4">
                <Bell className="h-6 w-6 text-gray-600" />
                <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </header>
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      ) : renderContent()}

      {/* Modals */}
      <Modal show={activeModal === 'Record Attendance'} onClose={() => setActiveModal(null)} title="Record Attendance">
        <form onSubmit={handleAttendanceSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Date</label>
              <input
                type="date"
                value={attendanceForm.service_date}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, service_date: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e40af] focus:ring focus:ring-[#1e40af] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Men</label>
              <input
                type="number"
                value={attendanceForm.men}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, men: e.target.value })}
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Women</label>
              <input
                type="number"
                value={attendanceForm.women}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, women: e.target.value })}
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Youth (Boys)</label>
              <input
                type="number"
                value={attendanceForm.youth_boys}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, youth_boys: e.target.value })}
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Youth (Girls)</label>
              <input
                type="number"
                value={attendanceForm.youth_girls}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, youth_girls: e.target.value })}
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Children (Boys)</label>
              <input
                type="number"
                value={attendanceForm.children_boys}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, children_boys: e.target.value })}
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Children (Girls)</label>
              <input
                type="number"
                value={attendanceForm.children_girls}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, children_girls: e.target.value })}
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Converts</label>
              <input
                type="number"
                value={attendanceForm.new_converts}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, new_converts: e.target.value })}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">YouTube Views</label>
              <input
                type="number"
                value={attendanceForm.youtube}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, youtube: e.target.value })}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-[#4680C2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3b6da6]"
            >
              Record Attendance
            </button>
          </div>
        </form>
      </Modal>

      <Modal show={activeModal === 'Record Payment'} onClose={() => setActiveModal(null)} title="Record New Payment">
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Date</label>
              <input
                type="date"
                value={paymentForm.date}
                onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Type</label>
              <select
                value={paymentForm.payment_type}
                onChange={(e) => setPaymentForm({ ...paymentForm, payment_type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              >
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="building_fund">Building Fund</option>
                <option value="generator_fund">Generator Fund</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Details</label>
              <select
                value={paymentForm.account_details}
                onChange={(e) => setPaymentForm({ ...paymentForm, account_details: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              >
                <option value="">Select Account</option>
                {accountDetails.map(account => (
                  <option key={account.id} value={`${account.account_name} - ${account.account_number}`}>
                    {account.account_name} - {account.account_number}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={paymentForm.description}
              onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
            />
          </div>
          <FileUpload
            onFileSelect={(fileData) => setPaymentForm({
              ...paymentForm,
              receipt_data: fileData.data,
              receipt_filename: fileData.name
            })}
            accept="image/*,application/pdf"
            label="Upload Receipt"
          />
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-[#4680C2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3b6da6]"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>

      <Modal show={activeModal === 'Add User'} onClose={() => setActiveModal(null)} title="Add New User">
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={userForm.full_name}
                onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={userForm.phone_number}
                onChange={(e) => setUserForm({ ...userForm, phone_number: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                value={userForm.gender}
                onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
              >
                <option value="secretary">Secretary</option>
                <option value="accountant">Accountant</option>
                <option value="group_admin">Group Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-[#4680C2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3b6da6]"
            >
              Add User
            </button>
          </div>
        </form>
      </Modal>

      <Modal show={activeModal === 'Add Project'} onClose={() => setActiveModal(null)} title="Add New Project">
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={projectForm.project_name}
              onChange={(e) => setProjectForm({ ...projectForm, project_name: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Amount</label>
            <input
              type="number"
              value={projectForm.target_amount}
              onChange={(e) => setProjectForm({ ...projectForm, target_amount: e.target.value })}
              min="1"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={projectForm.start_date}
              onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4680C2] focus:ring focus:ring-[#4680C2] focus:ring-opacity-50"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-[#4680C2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3b6da6]"
            >
              Add Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Receipt Preview Modals */}
      {paymentData.map(payment => (
        <Modal 
          key={`preview-${payment.id}`}
          show={activeModal === `preview-${payment.id}`} 
          onClose={() => setActiveModal(null)} 
          title={`Receipt Preview - ${payment.payment_type}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p className="text-gray-600">{formatDate(payment.date)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <p className="text-gray-600">{formatCurrency(payment.amount)}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-600">{payment.description || 'No description'}</p>
              </div>
            </div>
            
            {payment.receipt_path ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Receipt</h4>
                {payment.receipt_path.toLowerCase().includes('.pdf') ? (
                  <div className="flex items-center justify-center h-48 bg-gray-200 rounded border">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">PDF Receipt</p>
                      <a 
                        href={payment.receipt_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Open PDF
                      </a>
                    </div>
                  </div>
                ) : (
                  <img
                    src={payment.receipt_path}
                    alt="Receipt"
                    className="max-w-full h-64 object-contain rounded border mx-auto"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No receipt available</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      ))}
    </div>
  );
};

export default App;