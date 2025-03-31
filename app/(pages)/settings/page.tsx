'use client'
// pages/settings.tsx
import React, { useState } from 'react';
import { 
  Home, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  FileText, 
  Settings, 
  Bell, 
  Menu, 
  X,
  User,
  Lock,
  Upload,
  Link,
  Eye,
  EyeOff,
  LogOut,
  Smartphone,
  Check,
  Shield,
  Globe,
  Database,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  CreditCard as CreditCardIcon,
  ChevronRight
} from 'lucide-react';

// Types
interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface IntegrationItem {
  id: string;
  name: string;
  logo: React.ReactNode;
  connected: boolean;
  lastSync?: string;
}

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  email: boolean;
  browser: boolean;
  mobile: boolean;
}

export default function SettingsPage(): React.JSX.Element {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    jobTitle: 'Financial Manager',
    timeZone: 'America/New_York',
    language: 'English',
    currency: 'USD'
  });
  
  // Integration settings state
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    { id: 'quickbooks', name: 'QuickBooks', logo: <Briefcase className="w-6 h-6" />, connected: true, lastSync: '2025-03-28T14:30:00' },
    { id: 'stripe', name: 'Stripe', logo: <CreditCardIcon className="w-6 h-6" />, connected: true, lastSync: '2025-03-29T09:15:00' },
    { id: 'paypal', name: 'PayPal', logo: <DollarSign className="w-6 h-6" />, connected: false },
    { id: 'xero', name: 'Xero', logo: <Database className="w-6 h-6" />, connected: false },
    { id: 'bank', name: 'Bank Connection', logo: <CreditCardIcon className="w-6 h-6" />, connected: true, lastSync: '2025-03-30T08:45:00' },
  ]);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { 
      id: 'budget-alerts', 
      name: 'Budget Alerts', 
      description: 'Get notified when you exceed budget limits', 
      email: true, 
      browser: true, 
      mobile: true 
    },
    { 
      id: 'payment-reminders', 
      name: 'Payment Reminders', 
      description: 'Reminders for upcoming bill payments', 
      email: true, 
      browser: true, 
      mobile: false 
    },
    { 
      id: 'account-notifications', 
      name: 'Account Notifications', 
      description: 'Security and account-related notifications', 
      email: true, 
      browser: false, 
      mobile: true 
    },
    { 
      id: 'report-ready', 
      name: 'Reports Ready', 
      description: 'Notification when scheduled reports are ready', 
      email: true, 
      browser: false, 
      mobile: false 
    },
    { 
      id: 'new-features', 
      name: 'New Features', 
      description: 'Updates about new features and improvements', 
      email: false, 
      browser: true, 
      mobile: false 
    }
  ]);
  
  // Active sessions
  const activeSessions = [
    { id: '1', device: 'Windows PC - Chrome', location: 'New York, USA', lastActive: '2025-03-30T10:25:00', current: true },
    { id: '2', device: 'iPhone 16 - Safari', location: 'New York, USA', lastActive: '2025-03-29T18:12:00', current: false },
    { id: '3', device: 'iPad Pro - Chrome', location: 'Boston, USA', lastActive: '2025-03-25T09:47:00', current: false }
  ];
  
  // Tabs for settings
  const tabs: TabItem[] = [
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'security', name: 'Security', icon: <Lock className="w-5 h-5" /> },
    { id: 'integrations', name: 'Integrations', icon: <Link className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> }
  ];
  
  // Toggle notification settings
  const toggleNotification = (id: string, channel: 'email' | 'browser' | 'mobile') => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id
          ? { ...setting, [channel]: !setting[channel] }
          : setting
      )
    );
  };
  
  // Toggle integration connection
  const toggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id
          ? { 
              ...integration, 
              connected: !integration.connected,
              lastSync: integration.connected ? undefined : new Date().toISOString()
            }
          : integration
      )
    );
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle profile update
  const handleProfileUpdate = () => {
    // In a real app, this would make an API call to update the user profile
    alert('Profile updated successfully!');
  };
  
  // Handle password change
  const handlePasswordChange = () => {
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    // In a real app, this would make an API call to change the password
    alert('Password changed successfully!');
    
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-800">FinTrack</span>
          </div>
          <button 
            className="p-1 rounded-md lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <div className="space-y-4">
            <NavItem icon={<Home className="w-5 h-5" />} text="Dashboard" active={false} whichPage="dashboard" />
            <NavItem icon={<CreditCard className="w-5 h-5" />} text="Expenses" active={false} whichPage="expenses" />
            <NavItem icon={<DollarSign className="w-5 h-5" />} text="Revenue" active={false} whichPage="revenue" />
            <NavItem icon={<PieChart className="w-5 h-5" />} text="Budget" active={false} whichPage="budget" />
            <NavItem icon={<FileText className="w-5 h-5" />} text="Reports" active={false} whichPage="reports" />
            <NavItem icon={<Settings className="w-5 h-5" />} text="Settings" active={true} whichPage="settings" />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <button 
              className="p-1 rounded-md lg:hidden" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-500" />
            </button>
            
            <div className="flex items-center ml-auto">
              <button className="p-1 mr-4 rounded-full text-gray-500 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative">
                <button className="flex items-center text-sm focus:outline-none">
                  <img 
                    className="h-8 w-8 rounded-full object-cover"
                    src="/api/placeholder/32/32" 
                    alt="User profile" 
                  />
                  <span className="ml-2 text-gray-700 font-medium hidden md:block">John Doe</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
          </div>
          
          {/* Settings Container */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Settings Tabs */}
              <div className="md:w-64 border-r border-gray-200">
                <nav className="p-4 space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className={`mr-3 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'}`}>
                        {tab.icon}
                      </span>
                      {tab.name}
                    </button>
                  ))}
                  
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <button
                      className="flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-red-600 hover:bg-red-50"
                    >
                      <span className="mr-3 text-red-500">
                        <LogOut className="w-5 h-5" />
                      </span>
                      Sign Out
                    </button>
                  </div>
                </nav>
              </div>
              
              {/* Settings Content */}
              <div className="flex-1 overflow-hidden">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
                    
                    <div className="mb-8 flex items-center">
                      <div className="mr-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src="/api/placeholder/96/96" 
                            alt="Profile avatar"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                            <button className="p-1 rounded-full bg-white shadow text-gray-700 opacity-0 hover:opacity-100">
                              <Upload className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">{userProfile.firstName} {userProfile.lastName}</h3>
                        <p className="text-sm text-gray-500 mt-1">{userProfile.jobTitle} at {userProfile.company}</p>
                        <p className="text-sm text-gray-500 mt-1">Member since March 2023</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="first-name"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={userProfile.firstName}
                            onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="last-name"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={userProfile.lastName}
                            onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={userProfile.company}
                            onChange={(e) => setUserProfile({...userProfile, company: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            id="job-title"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={userProfile.jobTitle}
                            onChange={(e) => setUserProfile({...userProfile, jobTitle: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                            Time Zone
                          </label>
                          <select
                            id="timezone"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={userProfile.timeZone}
                            onChange={(e) => setUserProfile({...userProfile, timeZone: e.target.value})}
                          >
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                            <option value="Europe/Paris">Central European Time (CET)</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <select
                            id="language"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={userProfile.language}
                            onChange={(e) => setUserProfile({...userProfile, language: e.target.value})}
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                            Currency
                          </label>
                          <select
                            id="currency"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={userProfile.currency}
                            onChange={(e) => setUserProfile({...userProfile, currency: e.target.value})}
                          >
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                            <option value="GBP">British Pound (£)</option>
                            <option value="JPY">Japanese Yen (¥)</option>
                            <option value="CAD">Canadian Dollar (C$)</option>
                            <option value="AUD">Australian Dollar (A$)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="pt-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleProfileUpdate}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6 space-y-8">
                    <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                    
                    {/* Password Change */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              id="current-password"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="new-password"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="confirm-password"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handlePasswordChange}
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Two-Factor Authentication */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-md font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                          className={`${
                            twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                          } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            className={`${
                              twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          >
                            <span
                              className={`${
                                twoFactorEnabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
                              } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                              aria-hidden="true"
                            >
                              <Lock className="h-3 w-3 text-gray-400" />
                            </span>
                            <span
                              className={`${
                                twoFactorEnabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
                              } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                              aria-hidden="true"
                            >
                              <Shield className="h-3 w-3 text-blue-600" />
                            </span>
                          </span>
                        </button>
                      </div>
                      
                      {twoFactorEnabled && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Check className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-blue-800">
                                Two-factor authentication is enabled
                              </p>
                              <p className="mt-1 text-sm text-blue-700">
                                Your account is protected with an additional security layer. You'll need to enter a verification code from your mobile app when you sign in.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Active Sessions */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-md font-medium text-gray-900 mb-4">Active Sessions</h3>
                      <div className="space-y-4">
                        {activeSessions.map(session => (
                          <div key={session.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full ${session.current ? 'bg-green-100' : 'bg-gray-100'}`}>
                                {session.device.includes('iPhone') || session.device.includes('iPad') ? (
                                  <Smartphone className="h-5 w-5 text-gray-600" />
                                ) : (
                                  <Globe className="h-5 w-5 text-gray-600" />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{session.device}</p>
                                <div className="flex text-xs text-gray-500 mt-1">
                                  <span>{session.location}</span>
                                  <span className="mx-1">•</span>
                                  <span>{formatDate(session.lastActive)}</span>
                                  {session.current && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span className="text-green-600 font-medium">Current session</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            {!session.current && (
                              <button
                                type="button"
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Terminate
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out All Other Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Integration Settings */}
                {activeTab === 'integrations' && (
                  <div className="p-6 space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Integrations</h2>
                    <p className="text-sm text-gray-500">Connect your finance accounts and services for automatic data import</p>
                    
                    <div className="mt-6 space-y-4">
                      {integrations.map(integration => (
                        <div key={integration.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-gray-100 p-3 rounded-lg">
                                {integration.logo}
                              </div>
                              <div className="ml-4">
                                <h3 className="text-md font-medium text-gray-900">{integration.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {integration.connected 
                                    ? `Last synced: ${integration.lastSync ? formatDate(integration.lastSync) : 'Never'}` 
                                    : 'Not connected'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {integration.connected && (
                                <button
                                  type="button"
                                  className="mr-3 inline-flex items-center py-1 px-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Sync
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleIntegration(integration.id)}
                                className={`inline-flex items-center py-1 px-3 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                  integration.connected
                                    ? 'border-red-300 text-red-700 bg-white hover:bg-red-50'
                                    : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                                }`}
                              >
                                {integration.connected ? 'Disconnect' : 'Connect'}
                              </button>
                            </div>
                          </div>
                          
                          {integration.connected && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <div className="flex items-center mb-2 sm:mb-0">
                                  <Check className="w-5 h-5 text-green-500 mr-2" />
                                  <span className="text-sm text-gray-600">Connected and syncing data automatically</span>
                                </div>
                                <a
                                  href="#"
                                  className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                                >
                                  Configure settings
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-md font-medium text-gray-900 mb-4">Export Options</h3>
                      <div className="flex flex-wrap gap-4">
                        <button
                          type="button"
                          className="inline-flex items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Export to CSV
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Export to Excel
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Export to PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-6 space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                    <p className="text-sm text-gray-500">Configure how and when you receive notifications</p>
                    
                    <div className="mt-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Browser
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mobile
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {notificationSettings.map((setting) => (
                            <tr key={setting.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{setting.name}</div>
                                <div className="text-sm text-gray-500">{setting.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button 
                                  type="button"
                                  onClick={() => toggleNotification(setting.id, 'email')}
                                  className={`${
                                    setting.email ? 'text-blue-600' : 'text-gray-400'
                                  }`}
                                >
                                  {setting.email ? (
                                    <ToggleRight className="mx-auto h-6 w-6" />
                                  ) : (
                                    <ToggleLeft className="mx-auto h-6 w-6" />
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button 
                                  type="button"
                                  onClick={() => toggleNotification(setting.id, 'browser')}
                                  className={`${
                                    setting.browser ? 'text-blue-600' : 'text-gray-400'
                                  }`}
                                >
                                  {setting.browser ? (
                                    <ToggleRight className="mx-auto h-6 w-6" />
                                  ) : (
                                    <ToggleLeft className="mx-auto h-6 w-6" />
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button 
                                  type="button"
                                  onClick={() => toggleNotification(setting.id, 'mobile')}
                                  className={`${
                                    setting.mobile ? 'text-blue-600' : 'text-gray-400'
                                  }`}
                                >
                                  {setting.mobile ? (
                                    <ToggleRight className="mx-auto h-6 w-6" />
                                  ) : (
                                    <ToggleLeft className="mx-auto h-6 w-6" />
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-md font-medium text-gray-900 mb-4">Alert Thresholds</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="budget-alert" className="block text-sm font-medium text-gray-700 mb-1">
                            Budget Alert Threshold (%)
                          </label>
                          <div className="flex items-center">
                            <input
                              type="range"
                              id="budget-alert"
                              min="50"
                              max="100"
                              step="5"
                              defaultValue="80"
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700">80%</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Get notified when your spending reaches this percentage of the budget</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Low Balance Alerts</h4>
                            <p className="text-sm text-gray-500">Get notified when account balance falls below threshold</p>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-700">$500</span>
                            <button
                              type="button"
                              className="bg-blue-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <span className="sr-only">Enable notifications</span>
                              <span
                                className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                              ></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-5">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper Components
interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  whichPage?: string;
}

function NavItem({ icon, text, active, whichPage }: NavItemProps): React.JSX.Element {
  let link = '/'
  if (whichPage == "expenses") link = '/expenses'
  if (whichPage == "budget") link = '/budget'
  if (whichPage == "reports") link = '/reports'
  if (whichPage == "revenue") link = '/revenue'
  if (whichPage == "settings") link = '/settings'
  return (
    <a 
      href={link}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${
        active 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className={`mr-3 ${active ? 'text-blue-500' : 'text-gray-500'}`}>
        {icon}
      </span>
      {text}
    </a>
  );
}