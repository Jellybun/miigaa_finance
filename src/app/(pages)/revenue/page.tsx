'use client'
// pages/revenue.tsx
import React, { useState } from 'react';
import Profile from '../../(components)/profile'

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
  XCircle,
  Users,
} from 'lucide-react';

// Types
interface Revenue {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  client: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  invoice?: string;
  notes?: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

interface Client {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
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

export default function RevenuePage(): React.JSX.Element {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  
  // Sample data
  const categories: Category[] = [
    { id: 1, name: 'Үйлчилгээ', color: 'green' },
    { id: 2, name: 'Бүтээгдэхүүн', color: 'blue' },
    { id: 3, name: 'Захиалга', color: 'purple' },
    { id: 4, name: 'Зөвлөгөө', color: 'orange' },
    { id: 5, name: 'Лиценз', color: 'indigo' },
    { id: 6, name: 'Холбоотой', color: 'pink' },
    { id: 7, name: 'Эрх', color: 'yellow' },
    { id: 8, name: 'Бусад', color: 'gray' },
  ];
  
  const clients: Client[] = [
    { id: 1, name: 'Акме Корпораци', company: 'Акме Корп', email: 'billing@acmecorp.com' },
    { id: 2, name: 'Глобекс Индастриз', company: 'Глобекс', email: 'finance@globex.com' },
    { id: 3, name: 'Вэйн Энтерпрайз', company: 'Вэйн Энт', email: 'accounts@wayne.com' },
    { id: 4, name: 'Старк Индастриз', company: 'Старк Инк', email: 'payments@stark.com' },
    { id: 5, name: 'Хувь хүмүүс', company: 'Олон төрөл', email: '' },
  ];
  
  const revenues: Revenue[] = [
    { id: 1, date: '2025-03-30', description: 'Вэбсайт хөгжүүлэх төсөл', amount: 5000.00, category: 'Үйлчилгээ', client: 'Акме Корпораци', paymentMethod: 'Банкны шилжүүлэг', status: 'completed', invoice: 'НДБ-2025-001' },
    { id: 2, date: '2025-03-28', description: 'Сарын SaaS захиалга - 3-р сар', amount: 2500.00, category: 'Захиалга', client: 'Глобекс Индастриз', paymentMethod: 'Кредит карт', status: 'completed', invoice: 'НДБ-2025-002' },
    { id: 3, date: '2025-03-25', description: 'Мобайл апп хөгжүүлэлт - Алхам 1', amount: 7500.00, category: 'Үйлчилгээ', client: 'Вэйн Энтерпрайз', paymentMethod: 'Банкны шилжүүлэг', status: 'completed', invoice: 'НДБ-2025-003' },
    { id: 4, date: '2025-03-22', description: 'Программ хангамжийн лицензийн төлбөр', amount: 1200.00, category: 'Лиценз', client: 'Старк Индастриз', paymentMethod: 'Кредит карт', status: 'completed', invoice: 'НДБ-2025-004' },
    { id: 5, date: '2025-03-20', description: 'Зөвлөх үйлчилгээ - Сургалт', amount: 1800.00, category: 'Зөвлөгөө', client: 'Глобекс Индастриз', paymentMethod: 'Банкны шилжүүлэг', status: 'completed', invoice: 'НДБ-2025-005' },
    { id: 6, date: '2025-03-18', description: 'Онлайн худалдааны платформ - Үе 2', amount: 6000.00, category: 'Үйлчилгээ', client: 'Акме Корпораци', paymentMethod: 'Банкны шилжүүлэг', status: 'pending', invoice: 'НДБ-2025-006' },
    { id: 7, date: '2025-03-15', description: 'Бүтээгдэхүүний борлуулалт - Премиум багц', amount: 3500.00, category: 'Бүтээгдэхүүн', client: 'Хувь хүмүүс', paymentMethod: 'PayPal', status: 'completed', invoice: 'НДБ-2025-007' },
    { id: 8, date: '2025-03-12', description: 'Холбоотой маркетингийн шимтгэл', amount: 750.00, category: 'Холбоотой', client: 'Хувь хүмүүс', paymentMethod: 'PayPal', status: 'completed', invoice: 'НДБ-2025-008' },
    { id: 9, date: '2025-03-10', description: 'Жилийн засвар үйлчилгээний гэрээ', amount: 4200.00, category: 'Үйлчилгээ', client: 'Вэйн Энтерпрайз', paymentMethod: 'Банкны шилжүүлэг', status: 'pending', invoice: 'НДБ-2025-009' },
    { id: 10, date: '2025-03-05', description: 'UI/UX Дизайны үйлчилгээ', amount: 2800.00, category: 'Үйлчилгээ', client: 'Старк Индастриз', paymentMethod: 'Кредит карт', status: 'completed', invoice: 'НДБ-2025-010' },
    { id: 11, date: '2025-03-03', description: 'API интеграцийн төсөл', amount: 3200.00, category: 'Үйлчилгээ', client: 'Глобекс Индастриз', paymentMethod: 'Банкны шилжүүлэг', status: 'completed', invoice: 'НДБ-2025-011' },
    { id: 12, date: '2025-03-01', description: 'Онлайн семинарын тасалбар', amount: 980.00, category: 'Бүтээгдэхүүн', client: 'Хувь хүмүүс', paymentMethod: 'PayPal', status: 'cancelled', invoice: 'НДБ-2025-012' },
  ];
  
  // Constants
  const ITEMS_PER_PAGE = 10;
  
  // Filter revenues based on search, category, client, date range, and status
  const filteredRevenues = revenues.filter(revenue => {
    // Search filter
    const matchesSearch = revenue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         revenue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         revenue.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.includes(categories.find(cat => cat.name === revenue.category)?.id || 0);
    
    // Client filter
    const matchesClient = selectedClients.length === 0 || 
                         selectedClients.includes(clients.find(c => c.name === revenue.client)?.id || 0);
    
    // Date range filter
    const revenueDate = new Date(revenue.date);
    const matchesDateRange = (!dateRange.startDate || new Date(dateRange.startDate) <= revenueDate) &&
                            (!dateRange.endDate || new Date(dateRange.endDate) >= revenueDate);
    
    // Status filter
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(revenue.status);
    
    return matchesSearch && matchesCategory && matchesClient && matchesDateRange && matchesStatus;
  });
  
  // Sort revenues
  const sortedRevenues = [...filteredRevenues].sort((a, b) => {
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
    } else if (sortField === 'client') {
      return sortDirection === 'asc' 
        ? a.client.localeCompare(b.client)
        : b.client.localeCompare(a.client);
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedRevenues.length / ITEMS_PER_PAGE);
  const paginatedRevenues = sortedRevenues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // Calculate totals
  const totalAmount = filteredRevenues.reduce((sum, revenue) => sum + revenue.amount, 0);
  const totalPendingAmount = filteredRevenues
    .filter(revenue => revenue.status === 'pending')
    .reduce((sum, revenue) => sum + revenue.amount, 0);
  
  // Get category counts for filter checkboxes
  const categoryCount = revenues.reduce((acc, revenue) => {
    const category = categories.find(cat => cat.name === revenue.category);
    if (category) {
      acc[category.id] = (acc[category.id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
  
  // Get client counts for filter checkboxes
  const clientCount = revenues.reduce((acc, revenue) => {
    const client = clients.find(c => c.name === revenue.client);
    if (client) {
      acc[client.id] = (acc[client.id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
  
  // Get status counts for filter checkboxes
  const statusCount = revenues.reduce((acc, revenue) => {
    acc[revenue.status] = (acc[revenue.status] || 0) + 1;
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
  
  // Client selection handler
  const handleClientSelect = (clientId: number) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
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
    setSelectedClients([]);
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
    'green': 'bg-green-100 text-green-800',
    'blue': 'bg-blue-100 text-blue-800',
    'purple': 'bg-purple-100 text-purple-800',
    'orange': 'bg-orange-100 text-orange-800',
    'pink': 'bg-pink-100 text-pink-800',
    'indigo': 'bg-indigo-100 text-indigo-800',
    'yellow': 'bg-yellow-100 text-yellow-800',
    'gray': 'bg-gray-100 text-gray-800'
  };

  // Calculate some metrics for the stats cards
  const currentMonthRevenue = revenues
    .filter(rev => {
      const date = new Date(rev.date);
      const currentDate = new Date();
      return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, rev) => sum + rev.amount, 0);

  const previousMonthRevenue = 36000; // Hard-coded for example
  const percentChange = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
  
  // Group by client for top client calculation
  const revenueByClient = revenues.reduce((acc, rev) => {
    acc[rev.client] = (acc[rev.client] || 0) + rev.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Find top client
  let topClient = '';
  let topClientAmount = 0;
  Object.entries(revenueByClient).forEach(([client, amount]) => {
    if (amount > topClientAmount) {
      topClient = client;
      topClientAmount = amount;
    }
  });

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
            <span className="ml-2 text-xl font-semibold text-gray-800">СанХүрээ</span>
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
          <NavItem icon={<CreditCard className="w-5 h-5" />} text="Зарлагууд" active={false} whichPage='expenses'/>
          <NavItem icon={<DollarSign className="w-5 h-5" />} text="Орлого" active={true} whichPage='revenue'/>
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
            <h1 className="text-2xl font-semibold text-gray-800">Орлого</h1>
            <p className="text-gray-600 mt-1">Орлогын эх үүсвэрүүдийг хянах, удирдах</p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Нийт орлого</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-2">өмнөх сараас</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Хүлээгдэж буй орлого</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">${totalPendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">{filteredRevenues.filter(r => r.status === 'pending').length} хүлээгдэж буй нэхэмжлэх</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Шилдэг харилцагч</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">
                    {topClient}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">${topClientAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                  placeholder="Орлогуудыг хайх..."
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
                  Шүүлтүүр
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Орлого нэмэх
                </button>
              </div>
            </div>
            
            {/* Filter Panel */}
            {isFiltersOpen && (
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Date Range Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Огноо</h3>
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
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Ангилал</h3>
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
                  
                  {/* Client Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Харилцагчид</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {clients.map(client => (
                        <div key={client.id} className="flex items-center">
                          <input
                            id={`client-${client.id}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleClientSelect(client.id)}
                          />
                          <label htmlFor={`client-${client.id}`} className="ml-2 block text-sm text-gray-700">
                            {client.name} 
                            <span className="ml-1 text-xs text-gray-500">({clientCount[client.id] || 0})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Төлөв</h3>
                    <div className="space-y-2">
                      {[
                        { id: 'pending', name: 'Хүлээгдэж буй' },
                        { id: 'completed', name: 'Дууссан' },
                        { id: 'cancelled', name: 'Цуцлагдсан' }
                      ].map(status => (
                        <div key={status.id} className="flex items-center">
                          <input
                            id={`status-${status.id}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedStatus.includes(status.id)}
                            onChange={() => handleStatusSelect(status.id)}
                          />
                          <label htmlFor={`status-${status.id}`} className="ml-2 block text-sm text-gray-700">
                            {status.name} 
                            <span className="ml-1 text-xs text-gray-500">({statusCount[status.id] || 0})</span>
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
                    Шүүлтүүр цэвэрлэх
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Шүүлтүүр хэрэглэх
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Revenues Table */}
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
                        Огноо
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
                        Тайлбар
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
                      onClick={() => handleSort('client')}
                    >
                      <div className="flex items-center">
                        Харилцагч
                        {sortField === 'client' && (
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
                  {paginatedRevenues.length > 0 ? (
                    paginatedRevenues.map((revenue) => (
                      <tr key={revenue.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(revenue.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{revenue.description}</div>
                          <div className="text-xs text-gray-500">{revenue.invoice}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {revenue.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColorMap[getCategoryColor(revenue.category)]}`}>
                            {revenue.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[revenue.status]}`}>
                            {revenue.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {revenue.status === 'pending' && <Calendar className="w-3 h-3 mr-1" />}
                            {revenue.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                            <span className="capitalize">
                              {revenue.status === 'completed' && 'Дууссан'}
                              {revenue.status === 'pending' && 'Хүлээгдэж буй'}
                              {revenue.status === 'cancelled' && 'Цуцлагдсан'}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                          +${revenue.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                        Таны шүүлтүүртэй тохирох орлого олдсонгүй
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredRevenues.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> -ээс{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredRevenues.length)}
                      </span>{' '}
                      хүртэл, нийт <span className="font-medium">{filteredRevenues.length}</span> үр дүнгээс
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
      
      {/* Add Revenue Modal */}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Шинэ орлого нэмэх</h3>
                    
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="revenue-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Огноо
                          </label>
                          <input
                            type="date"
                            id="revenue-date"
                            name="revenue-date"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label htmlFor="revenue-amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Дүн ($)
                          </label>
                          <input
                            type="number"
                            id="revenue-amount"
                            name="revenue-amount"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="revenue-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Тайлбар
                        </label>
                        <input
                          type="text"
                          id="revenue-description"
                          name="revenue-description"
                          placeholder="Орлогын тайлбар оруулах"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="revenue-category" className="block text-sm font-medium text-gray-700 mb-1">
                            Ангилал
                          </label>
                          <select
                            id="revenue-category"
                            name="revenue-category"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Ангилал сонгох</option>
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="revenue-status" className="block text-sm font-medium text-gray-700 mb-1">
                            Төлөв
                          </label>
                          <select
                            id="revenue-status"
                            name="revenue-status"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="completed">Дууссан</option>
                            <option value="pending">Хүлээгдэж буй</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="revenue-client" className="block text-sm font-medium text-gray-700 mb-1">
                          Харилцагч
                        </label>
                        <select
                          id="revenue-client"
                          name="revenue-client"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Харилцагч сонгох</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="revenue-invoice" className="block text-sm font-medium text-gray-700 mb-1">
                            Нэхэмжлэлийн дугаар
                          </label>
                          <input
                            type="text"
                            id="revenue-invoice"
                            name="revenue-invoice"
                            placeholder="ж.нь. НДБ-2025-001"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="revenue-payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                            Төлбөрийн хэлбэр
                          </label>
                          <select
                            id="revenue-payment-method"
                            name="revenue-payment-method"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Төлбөрийн хэлбэр сонгох</option>
                            <option value="Credit Card">Кредит карт</option>
                            <option value="Bank Transfer">Банкны шилжүүлэг</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Cash">Бэлэн мөнгө</option>
                            <option value="Check">Чек</option>
                            <option value="Other">Бусад</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="revenue-notes" className="block text-sm font-medium text-gray-700 mb-1">
                          Тэмдэглэл (Заавал биш)
                        </label>
                        <textarea
                          id="revenue-notes"
                          name="revenue-notes"
                          rows={3}
                          placeholder="Энэ орлогын талаар нэмэлт мэдээлэл оруулах"
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
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Орлого хадгалах
                </button>
                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setIsAddModalOpen(false)}>
                  Цуцлах
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