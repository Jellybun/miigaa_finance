'use client'
// pages/expenses.tsx
import React, { useState, useEffect } from 'react';
import Profile from '@/(components)/Profile';
import { toast } from 'react-hot-toast'; // You'll need to install this package
import { useFormStatus } from 'react-dom'; // For form submission state

import { 
  Home, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  FileText, 
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
  XCircle,
  AlertCircle
} from 'lucide-react';

// Types
interface Expense {
  id?: number;
  date: string;
  description: string;
  amount: number;
  category: string; // Changed to string (direct input)
  status: 'pending' | 'completed' | 'cancelled';
  receipt_url?: string;
  notes?: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface FilterOptions {
  searchQuery?: string;
  categories?: string[];
  dateRange?: DateRange;
  statuses?: string[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Status badge color mapping - More vibrant colors
const statusColors = {
  pending: 'bg-amber-200 text-amber-900 border border-amber-300',
  completed: 'bg-emerald-200 text-emerald-900 border border-emerald-300',
  cancelled: 'bg-rose-200 text-rose-900 border border-rose-300'
};

// Category color mapping with more contrast
const categoryColorMap: Record<string, string> = {
  'blue': 'bg-blue-200 text-blue-900 border border-blue-300',
  'purple': 'bg-purple-200 text-purple-900 border border-purple-300',
  'green': 'bg-emerald-200 text-emerald-900 border border-emerald-300',
  'orange': 'bg-orange-200 text-orange-900 border border-orange-300',
  'pink': 'bg-pink-200 text-pink-900 border border-pink-300',
  'red': 'bg-rose-200 text-rose-900 border border-rose-300',
  'amber': 'bg-amber-200 text-amber-900 border border-amber-300',
  'indigo': 'bg-indigo-200 text-indigo-900 border border-indigo-300',
  'gray': 'bg-gray-200 text-gray-900 border border-gray-300',
  'cyan': 'bg-cyan-200 text-cyan-900 border border-cyan-300',
  'teal': 'bg-teal-200 text-teal-900 border border-teal-300',
  'violet': 'bg-violet-200 text-violet-900 border border-violet-300'
};

// Sample Data
const sampleExpenses: Expense[] = [
  {
    id: 1,
    date: '2025-05-01',
    description: 'Office Rent Payment',
    amount: 1500,
    category: 'Housing',
    status: 'completed',
    notes: 'Monthly office space rent'
  },
  {
    id: 2,
    date: '2025-05-02',
    description: 'Office Supplies',
    amount: 250.75,
    category: 'Supplies',
    status: 'completed',
    notes: 'Paper, ink, and other office supplies'
  },
  {
    id: 3,
    date: '2025-05-03',
    description: 'Team Lunch',
    amount: 142.50,
    category: 'Food',
    status: 'completed',
    notes: 'Monthly team building lunch'
  },
  {
    id: 4,
    date: '2025-05-03',
    description: 'Internet Service',
    amount: 89.99,
    category: 'Utilities',
    status: 'completed',
    notes: 'Monthly internet service fee'
  },
  {
    id: 5,
    date: '2025-05-05',
    description: 'Software Subscriptions',
    amount: 199.99,
    category: 'Software',
    status: 'completed',
    notes: 'Monthly software licensing fees'
  },
  {
    id: 6,
    date: '2025-05-10',
    description: 'Marketing Campaign',
    amount: 750,
    category: 'Marketing',
    status: 'pending',
    notes: 'Social media ad campaign'
  },
  {
    id: 7,
    date: '2025-05-15',
    description: 'Server Costs',
    amount: 350,
    category: 'Technology',
    status: 'pending',
    notes: 'Monthly server and hosting fees'
  },
  {
    id: 8,
    date: '2025-05-18',
    description: 'Business Trip',
    amount: 1200,
    category: 'Travel',
    status: 'pending',
    notes: 'Flight and hotel for client meeting'
  },
  {
    id: 9,
    date: '2025-05-20',
    description: 'Conference Registration',
    amount: 499,
    category: 'Professional Development',
    status: 'cancelled',
    notes: 'Cancelled industry conference'
  },
  {
    id: 10,
    date: '2025-05-25',
    description: 'Equipment Purchase',
    amount: 899.99,
    category: 'Equipment',
    status: 'completed',
    notes: 'New office equipment'
  }
];

// Delete Confirmation Modal
function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  expenseId, 
  expenseDescription 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (id: number) => void; 
  expenseId: number; 
  expenseDescription: string 
}) {
  if (!isOpen) return null;
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if the click is directly on the overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75" aria-hidden="true"></div>
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full mx-4 sm:mx-auto z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete Expense
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{expenseDescription}"? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => {
              onConfirm(expenseId);
              onClose();
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Submit Button Component
function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 sm:ml-3 sm:w-auto sm:text-sm"
    >
      {pending ? 'Saving...' : text}
    </button>
  );
}

export default function ExpensesPage(): React.JSX.Element {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  
  // State with sample data
  const [allExpenses, setAllExpenses] = useState<Expense[]>(sampleExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(sampleExpenses);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [stats, setStats] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    averageAmount: 0,
    pendingCount: 0
  });
  const [currentExpense, setCurrentExpense] = useState<Expense>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: '',
    status: 'pending',
    notes: ''
  });
  
  // Constants
  const ITEMS_PER_PAGE = 10;
  
  // Extract unique categories and update stats on expense changes
  useEffect(() => {
    const categories = [...new Set(allExpenses.map(expense => expense.category))].filter(Boolean);
    setUniqueCategories(categories);
    
    // Calculate stats
    const totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const pendingExpenses = allExpenses.filter(expense => expense.status === 'pending');
    const pendingAmount = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageAmount = allExpenses.length > 0 ? totalAmount / allExpenses.length : 0;
    
    setStats({
      totalAmount,
      pendingAmount,
      averageAmount,
      pendingCount: pendingExpenses.length
    });
  }, [allExpenses]);
  
  // Apply filters, sorting, and pagination
  useEffect(() => {
    let result = [...allExpenses];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(expense => 
        expense.description.toLowerCase().includes(query) || 
        expense.category.toLowerCase().includes(query) ||
        expense.notes?.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(expense => selectedCategories.includes(expense.category));
    }
    
    // Apply status filter
    if (selectedStatus.length > 0) {
      result = result.filter(expense => selectedStatus.includes(expense.status));
    }
    
    // Apply date range filter
    if (dateRange.startDate) {
      result = result.filter(expense => new Date(expense.date) >= new Date(dateRange.startDate));
    }
    
    if (dateRange.endDate) {
      result = result.filter(expense => new Date(expense.date) <= new Date(dateRange.endDate));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
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
    
    // Set total count and pages
    setTotalCount(result.length);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    
    // Apply pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedResult = result.slice(startIndex, endIndex);
    
    setFilteredExpenses(paginatedResult);
  }, [allExpenses, searchQuery, selectedCategories, selectedStatus, dateRange, sortField, sortDirection, currentPage]);
  
  // Form handlers
  const handleAddExpense = (formData: FormData) => {
    // Since we're not submitting to a server, we'll use preventDefault
    const newExpense: Expense = {
      id: Math.max(0, ...allExpenses.map(e => e.id || 0)) + 1,
      date: formData.get('expense-date') as string,
      description: formData.get('expense-description') as string,
      amount: parseFloat(formData.get('expense-amount') as string),
      category: formData.get('expense-category') as string,
      status: formData.get('expense-status') as 'pending' | 'completed' | 'cancelled',
      notes: formData.get('expense-notes') as string
    };
    
    setAllExpenses(prev => [...prev, newExpense]);
    setIsAddModalOpen(false);
    toast.success('Expense added successfully');
  };
  
  const handleUpdateExpense = (formData: FormData) => {
    const expenseId = parseInt(formData.get('expense-id') as string);
    
    const updatedExpense: Expense = {
      id: expenseId,
      date: formData.get('expense-date') as string,
      description: formData.get('expense-description') as string,
      amount: parseFloat(formData.get('expense-amount') as string),
      category: formData.get('expense-category') as string,
      status: formData.get('expense-status') as 'pending' | 'completed' | 'cancelled',
      notes: formData.get('expense-notes') as string
    };
    
    setAllExpenses(prev => prev.map(expense => 
      expense.id === expenseId ? updatedExpense : expense
    ));
    
    setIsEditModalOpen(false);
    toast.success('Expense updated successfully');
  };
  
  const handleDeleteExpense = (expenseId: number) => {
    setAllExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    toast.success('Expense deleted successfully');
  };
  
  // Sort handlers
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Edit expense
  const handleEditClick = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsEditModalOpen(true);
  };
  
  // Delete expense
  const handleDeleteClick = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsDeleteModalOpen(true);
  };
  
  // Category selection handler for filtering
  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };
  
  // Status selection handler
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      }
      return [...prev, status];
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setDateRange({ startDate: '', endDate: '' });
    setSelectedStatus([]);
    setIsFiltersOpen(false);
  };
  
  // Get a random color for categories that don't have a predefined color
  const getCategoryColor = (category: string): string => {
    const colors = Object.keys(categoryColorMap);
    // Use hash of the category name to deterministically pick a color
    const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  // Get category counts for filtering
  const getCategoryCount = (category: string): number => {
    return allExpenses.filter(e => e.category === category).length;
  };
  
  // Get status counts
  const getStatusCount = (status: string): number => {
    return allExpenses.filter(e => e.status === status).length;
  };

  // Handle modal overlay click
  const handleModalOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicked directly on the overlay
    if (e.target === e.currentTarget) {
      if (isAddModalOpen) setIsAddModalOpen(false);
      if (isEditModalOpen) setIsEditModalOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-indigo-800">
          <div className="flex items-center">
            <DollarSign className="w-6 h-6 text-indigo-200" />
            <span className="ml-2 text-xl font-semibold text-white">FinTrack</span>
          </div>
          <button 
            className="p-1 rounded-md lg:hidden text-indigo-200 hover:text-white" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
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
        <header className="bg-white shadow-md z-10 border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button 
              className="p-1 rounded-md lg:hidden" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex items-center ml-auto">
              <Profile />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mb-6 bg-indigo-800 text-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold">Зарлагууд</h1>
            <p className="mt-1 text-indigo-100">Бизнесийнхээ зарлагыг удирдаж, хянаарай</p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Нийт зарлага</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Таны одоогийн шүүлтүүр дээр үндэслэн</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Хүлээгдэж буй зарлага</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">${stats.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">{stats.pendingCount} хүлээгдэж буй гүйлгээ</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Дундаж зарлага</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">
                    ${stats.averageAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <PieChart className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Сонгосон хугацаанд</span>
              </div>
            </div>
          </div>
          
          {/* Search and Filter Row */}
          <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </button>
              </div>
            </div>
            
            {/* Filter Panel */}
            {isFiltersOpen && (
              <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50">
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
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={dateRange.startDate}
                          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label htmlFor="end-date" className="block text-sm text-gray-500 mb-1">Дуусах огноо</label>
                        <input
                          type="date"
                          id="end-date"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={dateRange.endDate}
                          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Filter - Now using string categories */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Ангиллууд</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {uniqueCategories.map(category => (
                        <div key={category} className="flex items-center">
                          <input
                            id={`category-${category}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategorySelect(category)}
                          />
                          <label htmlFor={`category-${category}`} className="ml-2 block text-sm text-gray-700">
                            {category} 
                            <span className="ml-1 text-xs text-gray-500">({getCategoryCount(category)})</span>
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
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedStatus.includes(status)}
                            onChange={() => handleStatusSelect(status)}
                          />
                          <label htmlFor={`status-${status}`} className="ml-2 block text-sm text-gray-700 capitalize">
                            {status} 
                            <span className="ml-1 text-xs text-gray-500">({getStatusCount(status)})</span>
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
                    className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Expenses Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      Төлөв
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Үйлдлүүд
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense, index) => (
                      <tr key={expense.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(expense.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{expense.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColorMap[getCategoryColor(expense.category)] || categoryColorMap['gray']}`}>
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[expense.status]}`}>
                            {expense.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {expense.status === 'pending' && <Calendar className="w-3 h-3 mr-1" />}
                            {expense.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                            <span className="capitalize">{expense.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-rose-600">
                          -${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 hover:bg-indigo-50 rounded"
                            onClick={() => handleEditClick(expense)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-rose-600 hover:text-rose-900 p-1 hover:bg-rose-50 rounded"
                            onClick={() => handleDeleteClick(expense)}
                          >
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
            {totalCount > 0 && (
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> -{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
                      </span>{' '}
                      нийт <span className="font-medium">{totalCount}</span> үр дүнгээс харуулж байна
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
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
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
      
      {/* Add Expense Modal - Updated for string category */}
      {isAddModalOpen && (
        <div 
          className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center"
          onClick={handleModalOverlayClick}
        >
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75" aria-hidden="true"></div>
          
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full mx-4 sm:mx-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-indigo-800 px-4 py-3 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-white">Шинэ зарлага нэмэх</h3>
            </div>
            
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddExpense(new FormData(e.currentTarget));
                }} 
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Огноо
                    </label>
                    <input
                      type="date"
                      id="expense-date"
                      name="expense-date"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required
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
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Ангилал
                    </label>
                    <input
                      type="text"
                      id="expense-category"
                      name="expense-category"
                      placeholder="Ангилал оруулна уу"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      list="category-suggestions"
                      required
                    />
                    <datalist id="category-suggestions">
                      {uniqueCategories.map(category => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label htmlFor="expense-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Төлөв
                    </label>
                    <select
                      id="expense-status"
                      name="expense-status"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    >
                      <option value="completed">Дууссан</option>
                      <option value="pending">Хүлээгдэж буй</option>
                      <option value="cancelled">Цуцалсан</option>
                    </select>
                  </div>
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Зарлага хадгалах
                  </button>
                  <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Болих
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Expense Modal - Updated for string category */}
      {isEditModalOpen && (
        <div 
          className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center"
          onClick={handleModalOverlayClick}
        >
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75" aria-hidden="true"></div>
          
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full mx-4 sm:mx-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-indigo-800 px-4 py-3 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-white">Зарлагыг засах</h3>
            </div>
            
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateExpense(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <input type="hidden" name="expense-id" value={currentExpense.id} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Огноо
                    </label>
                    <input
                      type="date"
                      id="expense-date"
                      name="expense-date"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentExpense.date}
                      required
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
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentExpense.amount}
                      required
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={currentExpense.description}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Ангилал
                    </label>
                    <input
                      type="text"
                      id="expense-category"
                      name="expense-category"
                      placeholder="Ангилал оруулна уу"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentExpense.category}
                      list="category-suggestions-edit"
                      required
                    />
                    <datalist id="category-suggestions-edit">
                      {uniqueCategories.map(category => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label htmlFor="expense-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Төлөв
                    </label>
                    <select
                      id="expense-status"
                      name="expense-status"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentExpense.status}
                      required
                    >
                      <option value="completed">Дууссан</option>
                      <option value="pending">Хүлээгдэж буй</option>
                      <option value="cancelled">Цуцалсан</option>
                    </select>
                  </div>
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={currentExpense.notes}
                  />
                </div>
                
                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Зарлагыг шинэчлэх
                  </button>
                  <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Болих
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteExpense}
        expenseId={currentExpense.id || 0}
        expenseDescription={currentExpense.description}
      />
    </div>
  );
}

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
          ? 'bg-indigo-800 text-white' 
          : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
      }`}
    >
      <span className={`mr-3 ${active ? 'text-white' : 'text-indigo-300'}`}>
        {icon}
      </span>
      {text}
    </a>
  );
}