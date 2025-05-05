'use client'
// pages/expenses.tsx
import React, { useState } from 'react';
import Profile from '@/(components)/Profile';

import { 
  Home, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X,
  Filter,
  ChevronDown,
  Plus,
  Calendar,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Types
interface Expense {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  receipt?: string;
  notes?: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

// Status badge color mapping
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function ExpensesPage(): React.JSX.Element {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  
  // Sample data
  const categories: Category[] = [
    { id: 1, name: 'Оффисын хэрэгсэл', color: 'blue' },
    { id: 2, name: 'Програм хангамж', color: 'purple' },
    { id: 3, name: 'Үйлчилгээ', color: 'green' },
    { id: 4, name: 'Аялал', color: 'orange' },
    { id: 5, name: 'Маркетинг', color: 'pink' },
    { id: 6, name: 'Түрээс', color: 'red' },
    { id: 7, name: 'Хоол', color: 'yellow' },
    { id: 8, name: 'Техник хангамж', color: 'indigo' },
  ];
  const expenses: Expense[] = [
    { id: 1, date: '2025-03-29', description: 'Оффисын хэрэгсэл - Принтерийн цаас', amount: 45.99, category: 'Оффисын хэрэгсэл', paymentMethod: 'Кредит карт', status: 'completed' },
    { id: 2, date: '2025-03-28', description: 'Adobe Creative Cloud захиалга', amount: 52.99, category: 'Програм хангамж', paymentMethod: 'Кредит карт', status: 'completed' },
    { id: 3, date: '2025-03-25', description: 'Цахилгааны төлбөр', amount: 175.45, category: 'Үйлчилгээ', paymentMethod: 'Банкны шилжүүлэг', status: 'completed' },
    { id: 4, date: '2025-03-22', description: 'Бизнесийн үдийн хоол - Үйлчлүүлэгчтэй уулзалт', amount: 87.65, category: 'Хоол', paymentMethod: 'Кредит карт', status: 'completed' },
    { id: 5, date: '2025-03-20', description: 'Google Workspace захиалга', amount: 18.00, category: 'Програм хангамж', paymentMethod: 'Кредит карт', status: 'completed' },
    { id: 6, date: '2025-03-18', description: 'Оффисын түрээс - 4 сар', amount: 1500.00, category: 'Түрээс', paymentMethod: 'Банкны шилжүүлэг', status: 'pending' },
    { id: 7, date: '2025-03-15', description: 'Facebook зар сурталчилгаа', amount: 350.00, category: 'Маркетинг', paymentMethod: 'Кредит карт', status: 'completed' },
    { id: 8, date: '2025-03-12', description: 'Шинэ дэлгэц - Dell 27"', amount: 329.99, category: 'Техник хангамж', paymentMethod: 'Кредит карт', status: 'completed' },
    { id: 9, date: '2025-03-10', description: 'Интернет үйлчилгээ - 4 сар', amount: 89.99, category: 'Үйлчилгээ', paymentMethod: 'Банкны шилжүүлэг', status: 'pending' },
    { id: 10, date: '2025-03-05', description: 'Зочид буудал - Бизнес аялал', amount: 435.80, category: 'Аялал', paymentMethod: 'Кредит карт', status: 'completed' },
    { id: 11, date: '2025-03-05', description: 'Онгоцны билет - Бизнес аялал', amount: 578.50, category: 'Аялал', paymentMethod: 'Кредит карт', status: 'completed' },
    { id: 12, date: '2025-03-02', description: 'Оффисын цэвэрлэгээний үйлчилгээ', amount: 120.00, category: 'Оффисын хэрэгсэл', paymentMethod: 'Банкны шилжүүлэг', status: 'cancelled' },
  ];
  
  // Constants
  const ITEMS_PER_PAGE = 10;
  
  // Filter expenses based on search, category, date range, and status
  const filteredExpenses = expenses.filter(expense => {
    // Search filter
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.includes(categories.find(cat => cat.name === expense.category)?.id || 0);
    
    // Date range filter
    const expenseDate = new Date(expense.date);
    const matchesDateRange = (!dateRange.startDate || new Date(dateRange.startDate) <= expenseDate) &&
                            (!dateRange.endDate || new Date(dateRange.endDate) >= expenseDate);
    
    // Status filter
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(expense.status);
    
    return matchesSearch && matchesCategory && matchesDateRange && matchesStatus;
  });
  
  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortField === 'description') {
      return sortDirection === 'asc' 
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    } else if (sortField === 'category') {
      return sortDirection === 'asc' 
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // Calculate totals
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPendingAmount = filteredExpenses
    .filter(expense => expense.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Get category counts for filter checkboxes
  const categoryCount = expenses.reduce((acc, expense) => {
    const category = categories.find(cat => cat.name === expense.category);
    if (category) {
      acc[category.id] = (acc[category.id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
  
  // Get status counts for filter checkboxes
  const statusCount = expenses.reduce((acc, expense) => {
    acc[expense.status] = (acc[expense.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort handlers
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Category selection handler
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Status selection handler
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setDateRange({ startDate: '', endDate: '' });
    setSelectedStatus([]);
    setIsFiltersOpen(false);
  };
  
  // Get the category color for the badge
  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'gray';
  };
  
  const categoryColorMap: Record<string, string> = {
    'blue': 'bg-blue-100 text-blue-800',
    'purple': 'bg-purple-100 text-purple-800',
    'green': 'bg-green-100 text-green-800',
    'orange': 'bg-orange-100 text-orange-800',
    'pink': 'bg-pink-100 text-pink-800',
    'red': 'bg-red-100 text-red-800',
    'yellow': 'bg-yellow-100 text-yellow-800',
    'indigo': 'bg-indigo-100 text-indigo-800',
    'gray': 'bg-gray-100 text-gray-800'
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
          <NavItem icon={<Home className="w-5 h-5" />} text="Хяналтын самбар" active={false} whichPage='dashboard'/>
          <NavItem icon={<CreditCard className="w-5 h-5" />} text="Зарлагууд" active={true} whichPage='expenses'/>
          <NavItem icon={<DollarSign className="w-5 h-5" />} text="Орлого" active={false} whichPage='revenue'/>
          <NavItem icon={<PieChart className="w-5 h-5" />} text="Төсөв" active={false} whichPage='budget'/>
          <NavItem icon={<FileText className="w-5 h-5" />} text="Тайлан" active={false} whichPage='reports'/>
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
              <Profile />

              </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Зарлагууд</h1>
              <p className="text-gray-600 mt-1">Бизнесийнхээ зарлагыг удирдаж, хянаарай</p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Нийт зарлага</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              </div>
              <div className="mt-4">
              <span className="text-sm text-gray-500">Таны одоогийн шүүлтүүр дээр үндэслэн</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Хүлээгдэж буй зарлага</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">${totalPendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              </div>
              <div className="mt-4">
              <span className="text-sm text-gray-500">{filteredExpenses.filter(e => e.status === 'pending').length} хүлээгдэж буй гүйлгээ</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Дундаж зарлага</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">
                    ${filteredExpenses.length ? 
                      (totalAmount / filteredExpenses.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                      '0.00'}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <PieChart className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Сонгосон хугацаанд</span>
              </div>
            </div>
          </div>
          
          {/* Search and Filter Row */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </button>
              </div>
            </div>
            
            {/* Filter Panel */}
            {isFiltersOpen && (
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Date Range Filter */}
                    <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Огнооны хүрээ</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                      <label htmlFor="start-date" className="block text-sm text-gray-500 mb-1">Эхлэх огноо</label>
                      <input
                        type="date"
                        id="start-date"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                      </div>
                      <div>
                      <label htmlFor="end-date" className="block text-sm text-gray-500 mb-1">Дуусах огноо</label>
                        <input
                          type="date"
                          id="end-date"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={dateRange.endDate}
                          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Ангиллууд</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center">
                          <input
                            id={`category-${category.id}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategorySelect(category.id)}
                          />
                          <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-700">
                            {category.name} 
                            <span className="ml-1 text-xs text-gray-500">({categoryCount[category.id] || 0})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Төлөв</h3>
                    <div className="space-y-2">
                      {['pending', 'completed', 'cancelled'].map(status => (
                        <div key={status} className="flex items-center">
                          <input
                            id={`status-${status}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            
                            checked={selectedStatus.includes(status)}
                            onChange={() => handleStatusSelect(status)}
                          />
                          <label htmlFor={`status-${status}`} className="ml-2 block text-sm text-gray-700 capitalize">
                            {status} 
                            <span className="ml-1 text-xs text-gray-500">({statusCount[status] || 0})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Filter actions */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Expenses Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === 'date' && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="ml-1 h-4 w-4" /> : 
                            <ArrowDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('description')}
                    >
                      <div className="flex items-center">
                        Description
                        {sortField === 'description' && (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="ml-1 h-4 w-4" /> : 
                            <ArrowDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center">
                      Ангилал
                      {sortField === 'category' && (
                        sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-4 w-4" /> : 
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Төлөв
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center justify-end">
                      Дүн
                      {sortField === 'amount' && (
                        sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-4 w-4" /> : 
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Үйлдлүүд
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedExpenses.length > 0 ? (
                    paginatedExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-xs text-gray-500">{expense.paymentMethod}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColorMap[getCategoryColor(expense.category)]}`}>
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[expense.status]}`}>
                            {expense.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {expense.status === 'pending' && <Calendar className="w-3 h-3 mr-1" />}
                            {expense.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                            <span className="capitalize">{expense.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                          -${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                        Таны шүүлтүүрт тохирох зарлага олдсонгүй
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredExpenses.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> -{' '}
                      <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredExpenses.length)}
                      </span>{' '}
                      нийт <span className="font-medium">{filteredExpenses.length}</span> үр дүнгээс харуулж байна
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Өмнөх</span>
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Page buttons */}
                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                        const pageNumber = idx + 1;
                        return (
                          <button
                            key={idx}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNumber
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Дараах</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Add Expense Modal */}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Шинэ зарлага нэмэх</h3>
                    
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">
                          Огноо
                          </label>
                          <input
                          type="date"
                          id="expense-date"
                          name="expense-date"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Дүн ($)
                          </label>
                          <input
                            type="number"
                            id="expense-amount"
                            name="expense-amount"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                        <div>
                        <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Тайлбар
                        </label>
                        <input
                          type="text"
                          id="expense-description"
                          name="expense-description"
                          placeholder="Зарлагын тайлбарыг оруулна уу"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">
                          Ангилал
                          </label>
                          <select
                          id="expense-category"
                          name="expense-category"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                          <option value="">Ангилал сонгоно уу</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="expense-payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                          Төлбөрийн арга
                          </label>
                            <select
                            id="expense-payment-method"
                            name="expense-payment-method"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                            <option value="">Төлбөрийн арга сонгоно уу</option>
                            <option value="Credit Card">Кредит карт</option>
                            <option value="Debit Card">Дебит карт</option>
                            <option value="Bank Transfer">Банкны шилжүүлэг</option>
                            <option value="Cash">Бэлэн мөнгө</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Other">Бусад</option>
                            </select>
                          </div>
                          </div>
                          
                          <div>
                          <label htmlFor="expense-status" className="block text-sm font-medium text-gray-700 mb-1">
                            Төлөв
                          </label>
                          <select
                            id="expense-status"
                            name="expense-status"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="completed">Дууссан</option>
                            <option value="pending">Хүлээгдэж буй</option>
                          </select>
                          </div>
                          
                          <div>
                          <label htmlFor="expense-notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Тэмдэглэл (Сонголттой)
                          </label>
                          <textarea
                            id="expense-notes"
                            name="expense-notes"
                            rows={3}
                            placeholder="Энэ зарлагын талаар нэмэлт мэдээлэл оруулна уу"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          </div>
                          
                          <div>
                        </div>
                      </form>
                      </div>
                    </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                      Зарлага хадгалах
                    </button>
                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setIsAddModalOpen(false)}>
                      Болих
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