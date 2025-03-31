'use client'
// pages/budget.tsx
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
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Check,
  Calendar,
  ArrowUp,
  ArrowDown,
  Save,
  Trash2
} from 'lucide-react';

// Types
interface BudgetCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  budgetAmount: number;
  actualSpent: number;
  previousMonthSpent: number;
  transactions: number;
}

interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  daysRemaining: number;
  dailyBudget: number;
}

type TimePeriod = 'monthly' | 'quarterly' | 'yearly';
type ViewMode = 'cards' | 'table';

export default function BudgetPage(): React.JSX.Element {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('monthly');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  
  // Current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  // Sample budget data
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    { 
      id: 1, 
      name: 'Housing', 
      icon: <Home className="w-5 h-5" />, 
      color: 'blue', 
      budgetAmount: 1500, 
      actualSpent: 1500, 
      previousMonthSpent: 1500,
      transactions: 1
    },
    { 
      id: 2, 
      name: 'Food & Dining', 
      icon: <DollarSign className="w-5 h-5" />, 
      color: 'green', 
      budgetAmount: 600, 
      actualSpent: 485.75, 
      previousMonthSpent: 550.20,
      transactions: 15
    },
    { 
      id: 3, 
      name: 'Transportation', 
      icon: <CreditCard className="w-5 h-5" />, 
      color: 'orange', 
      budgetAmount: 400, 
      actualSpent: 367.50, 
      previousMonthSpent: 385.30,
      transactions: 8
    },
    { 
      id: 4, 
      name: 'Utilities', 
      icon: <Settings className="w-5 h-5" />, 
      color: 'yellow', 
      budgetAmount: 250, 
      actualSpent: 235.42, 
      previousMonthSpent: 238.75,
      transactions: 4
    },
    { 
      id: 5, 
      name: 'Entertainment', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'purple', 
      budgetAmount: 300, 
      actualSpent: 354.28, 
      previousMonthSpent: 287.65,
      transactions: 9
    },
    { 
      id: 6, 
      name: 'Healthcare', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'red', 
      budgetAmount: 200, 
      actualSpent: 75.50, 
      previousMonthSpent: 150.00,
      transactions: 2
    },
    { 
      id: 7, 
      name: 'Personal Care', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'pink', 
      budgetAmount: 150, 
      actualSpent: 127.85, 
      previousMonthSpent: 142.15,
      transactions: 6
    },
    { 
      id: 8, 
      name: 'Education', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'indigo', 
      budgetAmount: 200, 
      actualSpent: 200, 
      previousMonthSpent: 200,
      transactions: 1
    },
    { 
      id: 9, 
      name: 'Savings', 
      icon: <DollarSign className="w-5 h-5" />, 
      color: 'cyan', 
      budgetAmount: 800, 
      actualSpent: 800, 
      previousMonthSpent: 800,
      transactions: 1
    },
    { 
      id: 10, 
      name: 'Miscellaneous', 
      icon: <Settings className="w-5 h-5" />, 
      color: 'gray', 
      budgetAmount: 100, 
      actualSpent: 65.25, 
      previousMonthSpent: 85.40,
      transactions: 4
    }
  ]);
  
  // Calculate budget summary
  const calculateBudgetSummary = (): BudgetSummary => {
    const totalBudget = budgetCategories.reduce((sum, category) => sum + category.budgetAmount, 0);
    const totalSpent = budgetCategories.reduce((sum, category) => sum + category.actualSpent, 0);
    const remainingBudget = totalBudget - totalSpent;
    const percentageUsed = (totalSpent / totalBudget) * 100;
    
    // Calculate days remaining in month
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = lastDayOfMonth - today.getDate();
    
    // Calculate daily budget based on remaining budget and days
    const dailyBudget = remainingBudget / (daysRemaining === 0 ? 1 : daysRemaining);
    
    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      percentageUsed,
      daysRemaining,
      dailyBudget
    };
  };
  
  const budgetSummary = calculateBudgetSummary();
  
  // Colors for budget status
  const getBudgetStatusColor = (budgetAmount: number, actualSpent: number): string => {
    const percentageUsed = (actualSpent / budgetAmount) * 100;
    
    if (percentageUsed < 70) return 'bg-green-500';
    if (percentageUsed < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Handle budget update
  const handleUpdateBudget = (categoryId: number) => {
    // Validate input first
    if (!newBudgetAmount || isNaN(parseFloat(newBudgetAmount))) {
      return;
    }
    
    const amount = parseFloat(newBudgetAmount);
    
    // Update the budget for the selected category
    setBudgetCategories(prev => 
      prev.map(category => 
        category.id === categoryId
          ? { ...category, budgetAmount: amount }
          : category
      )
    );
    
    // Reset state
    setEditingCategoryId(null);
    setNewBudgetAmount('');
  };
  
  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort budget categories
  const sortedCategories = [...budgetCategories].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'budgetAmount') {
      return sortDirection === 'asc' 
        ? a.budgetAmount - b.budgetAmount
        : b.budgetAmount - a.budgetAmount;
    } else if (sortField === 'actualSpent') {
      return sortDirection === 'asc' 
        ? a.actualSpent - b.actualSpent
        : b.actualSpent - a.actualSpent;
    } else if (sortField === 'percentage') {
      const percentageA = (a.actualSpent / a.budgetAmount) * 100;
      const percentageB = (b.actualSpent / b.budgetAmount) * 100;
      return sortDirection === 'asc' 
        ? percentageA - percentageB
        : percentageB - percentageA;
    }
    return 0;
  });
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return '$' + value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Toggle category expansion
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Category color map
  const categoryColorMap: Record<string, string> = {
    'blue': 'bg-blue-100 text-blue-800',
    'green': 'bg-green-100 text-green-800',
    'orange': 'bg-orange-100 text-orange-800',
    'yellow': 'bg-yellow-100 text-yellow-800',
    'purple': 'bg-purple-100 text-purple-800',
    'red': 'bg-red-100 text-red-800',
    'pink': 'bg-pink-100 text-pink-800',
    'indigo': 'bg-indigo-100 text-indigo-800',
    'cyan': 'bg-cyan-100 text-cyan-800',
    'gray': 'bg-gray-100 text-gray-800'
  };
  
  // Add new budget category
  const [newCategory, setNewCategory] = useState({
    name: '',
    budgetAmount: '',
    color: 'blue'
  });
  
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budgetAmount) return;
    
    const newId = Math.max(...budgetCategories.map(c => c.id)) + 1;
    
    const newCategoryItem: BudgetCategory = {
      id: newId,
      name: newCategory.name,
      icon: <Settings className="w-5 h-5" />,
      color: newCategory.color,
      budgetAmount: parseFloat(newCategory.budgetAmount),
      actualSpent: 0,
      previousMonthSpent: 0,
      transactions: 0
    };
    
    setBudgetCategories(prev => [...prev, newCategoryItem]);
    setNewCategory({ name: '', budgetAmount: '', color: 'blue' });
    setIsAddModalOpen(false);
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
            <NavItem icon={<PieChart className="w-5 h-5" />} text="Budget" active={true} whichPage="budget" />
            <NavItem icon={<FileText className="w-5 h-5" />} text="Reports" active={false} whichPage="reports" />
            <NavItem icon={<Settings className="w-5 h-5" />} text="Settings" active={false} whichPage="settings" />
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
            <h1 className="text-2xl font-semibold text-gray-800">Budget Management</h1>
            <p className="text-gray-600 mt-1">Track and manage your spending across categories</p>
          </div>
          
          {/* Budget Period Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-lg font-medium text-gray-800">
                  {selectedPeriod === 'monthly' && `${currentMonth} ${currentYear}`}
                  {selectedPeriod === 'quarterly' && `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentYear}`}
                  {selectedPeriod === 'yearly' && `${currentYear}`}
                </span>
              </div>
              
              <div className="flex space-x-1 ml-4">
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === 'monthly' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setSelectedPeriod('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === 'quarterly' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setSelectedPeriod('quarterly')}
                >
                  Quarterly
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${selectedPeriod === 'yearly' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setSelectedPeriod('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end space-x-4">
              <div className="flex space-x-1">
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === 'cards' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setViewMode('cards')}
                >
                  Card View
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setViewMode('table')}
                >
                  Table View
                </button>
              </div>
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Category
              </button>
            </div>
          </div>
          
          {/* Budget Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Budget</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">{formatCurrency(budgetSummary.totalBudget)}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">For {selectedPeriod === 'monthly' ? 'this month' : selectedPeriod === 'quarterly' ? 'this quarter' : 'this year'}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">{formatCurrency(budgetSummary.totalSpent)}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <CreditCard className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${getBudgetStatusColor(budgetSummary.totalBudget, budgetSummary.totalSpent)} h-2.5 rounded-full`}
                    style={{ width: `${Math.min(budgetSummary.percentageUsed, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 mt-1">{budgetSummary.percentageUsed.toFixed(1)}% of budget used</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Remaining Budget</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">{formatCurrency(budgetSummary.remainingBudget)}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">{budgetSummary.daysRemaining} days remaining</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Daily Budget</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">{formatCurrency(budgetSummary.dailyBudget)}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Safe daily spending limit</span>
              </div>
            </div>
          </div>
          
          {/* Budget Categories - Card View */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {sortedCategories.map(category => (
                <div 
                  key={category.id} 
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md ${categoryColorMap[category.color].split(' ')[0]}`}>
                          {category.icon}
                        </div>
                        <h3 className="ml-3 text-lg font-medium text-gray-900">{category.name}</h3>
                      </div>
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {expandedCategories.includes(category.id) ? 
                          <ChevronUp className="w-5 h-5" /> : 
                          <ChevronDown className="w-5 h-5" />
                        }
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Budget</p>
                        {editingCategoryId === category.id ? (
                          <div className="flex mt-1">
                            <input
                              type="number"
                              className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={newBudgetAmount}
                              onChange={(e) => setNewBudgetAmount(e.target.value)}
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={() => handleUpdateBudget(category.id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center mt-1">
                            <p className="text-lg font-semibold text-gray-800">{formatCurrency(category.budgetAmount)}</p>
                            <button
                              onClick={() => {
                                setEditingCategoryId(category.id);
                                setNewBudgetAmount(category.budgetAmount.toString());
                              }}
                              className="ml-2 text-gray-400 hover:text-blue-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Spent</p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{formatCurrency(category.actualSpent)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-1 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {((category.actualSpent / category.budgetAmount) * 100).toFixed(1)}% used
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(category.budgetAmount - category.actualSpent)} left
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${getBudgetStatusColor(category.budgetAmount, category.actualSpent)} h-2.5 rounded-full`}
                        style={{ width: `${Math.min((category.actualSpent / category.budgetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    {/* Expanded View */}
                    {expandedCategories.includes(category.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Previous Month</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(category.previousMonthSpent)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Month-over-month</span>
                          {category.actualSpent > category.previousMonthSpent ? (
                            <span className="text-sm font-medium text-red-600 flex items-center">
                              <ArrowUp className="w-3 h-3 mr-1" />
                              {formatCurrency(category.actualSpent - category.previousMonthSpent)}
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-green-600 flex items-center">
                              <ArrowDown className="w-3 h-3 mr-1" />
                              {formatCurrency(category.previousMonthSpent - category.actualSpent)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Transactions</span>
                          <span className="text-sm font-medium text-gray-900">{category.transactions}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Budget Categories - Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Category
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="ml-1 h-4 w-4" /> : 
                              <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('budgetAmount')}
                      >
                        <div className="flex items-center justify-end">
                          Budget
                          {sortField === 'budgetAmount' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="ml-1 h-4 w-4" /> : 
                              <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('actualSpent')}
                      >
                        <div className="flex items-center justify-end">
                          Spent
                          {sortField === 'actualSpent' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="ml-1 h-4 w-4" /> : 
                              <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('percentage')}
                      >
                        <div className="flex items-center justify-end">
                          % Used
                          {sortField === 'percentage' && (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="ml-1 h-4 w-4" /> : 
                              <ArrowDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remaining
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedCategories.map((category) => {
                      const percentageUsed = (category.actualSpent / category.budgetAmount) * 100;
                      const remaining = category.budgetAmount - category.actualSpent;
                      
                      return (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-md ${categoryColorMap[category.color].split(' ')[0]}`}>
                                {category.icon}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                <div className="text-xs text-gray-500">{category.transactions} transactions</div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {editingCategoryId === category.id ? (
                              <div className="flex justify-end">
                                <div className="w-32">
                                  <input
                                    type="number"
                                    className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={newBudgetAmount}
                                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                                <button
                                  onClick={() => handleUpdateBudget(category.id)}
                                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end items-center">
                                <span className="font-medium text-gray-900">{formatCurrency(category.budgetAmount)}</span>
                                <button
                                  onClick={() => {
                                    setEditingCategoryId(category.id);
                                    setNewBudgetAmount(category.budgetAmount.toString());
                                  }}
                                  className="ml-2 text-gray-400 hover:text-blue-600"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                            {formatCurrency(category.actualSpent)}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <div className="flex items-center justify-end">
                              <span className={`font-medium ${
                                percentageUsed < 70 ? 'text-green-600' : 
                                percentageUsed < 90 ? 'text-yellow-600' : 
                                'text-red-600'
                              }`}>
                                {percentageUsed.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            {formatCurrency(remaining)}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center">
                              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`${getBudgetStatusColor(category.budgetAmount, category.actualSpent)} h-2 rounded-full`}
                                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => toggleCategory(category.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {expandedCategories.includes(category.id) ? 
                                  <ChevronUp className="w-5 h-5" /> : 
                                  <ChevronDown className="w-5 h-5" />
                                }
                              </button>
                              <button className="text-red-400 hover:text-red-600">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed z-40 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsAddModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Add New Budget Category</h3>
                    
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
                          Category Name
                        </label>
                        <input
                          type="text"
                          id="category-name"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g. Entertainment, Groceries, etc."
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="budget-amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Budget Amount ($)
                        </label>
                        <input
                          type="number"
                          id="budget-amount"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={newCategory.budgetAmount}
                          onChange={(e) => setNewCategory({...newCategory, budgetAmount: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category Color
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo', 'cyan', 'orange', 'gray'].map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`h-8 rounded-md ${categoryColorMap[color].split(' ')[0]} ${
                                newCategory.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                              }`}
                              onClick={() => setNewCategory({...newCategory, color})}
                            />
                          ))}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddCategory}
                >
                  Add Category
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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