'use client'
// pages/revenue.tsx
import React, { useState, useEffect } from 'react';
import Profile from '@/(components)/Profile';
import { toast } from 'react-hot-toast';

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
  Users,
  AlertCircle
} from 'lucide-react';

// Types
interface Revenue {
  id?: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  client: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'cancelled';
  invoice?: string;
  notes?: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

// Status badge color mapping
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

// Delete Confirmation Modal
function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  revenueId, 
  revenueDescription 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (id: number) => void; 
  revenueId: number; 
  revenueDescription: string 
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
                Delete Revenue
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{revenueDescription}"? This action cannot be undone.
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
              onConfirm(revenueId);
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
  return (
    <button
      type="submit"
      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
    >
      {text}
    </button>
  );
}

export default function RevenuePage() {
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
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  
  // Initial Revenue Data (replacing server data)
  const [allRevenues, setAllRevenues] = useState<Revenue[]>([
    { 
      id: 1, 
      date: '2025-03-30', 
      description: 'Вэбсайт хөгжүүлэх төсөл', 
      amount: 5000.00, 
      category: 'Үйлчилгээ', 
      client: 'Акме Корпораци', 
      payment_method: 'Банкны шилжүүлэг', 
      status: 'completed', 
      invoice: 'НДБ-2025-001' 
    },
    { 
      id: 2, 
      date: '2025-03-28', 
      description: 'Сарын SaaS захиалга - 3-р сар', 
      amount: 2500.00, 
      category: 'Захиалга', 
      client: 'Глобекс Индастриз', 
      payment_method: 'Кредит карт', 
      status: 'completed', 
      invoice: 'НДБ-2025-002' 
    },
    { 
      id: 3, 
      date: '2025-03-25', 
      description: 'Мобайл апп хөгжүүлэлт - Алхам 1', 
      amount: 7500.00, 
      category: 'Үйлчилгээ', 
      client: 'Вэйн Энтерпрайз', 
      payment_method: 'Банкны шилжүүлэг', 
      status: 'completed', 
      invoice: 'НДБ-2025-003' 
    },
    { 
      id: 4, 
      date: '2025-03-22', 
      description: 'Программ хангамжийн лицензийн төлбөр', 
      amount: 1200.00, 
      category: 'Лиценз', 
      client: 'Старк Индастриз', 
      payment_method: 'Кредит карт', 
      status: 'completed', 
      invoice: 'НДБ-2025-004' 
    },
    { 
      id: 5, 
      date: '2025-03-20', 
      description: 'Зөвлөх үйлчилгээ - Сургалт', 
      amount: 1800.00, 
      category: 'Зөвлөгөө', 
      client: 'Глобекс Индастриз', 
      payment_method: 'Банкны шилжүүлэг', 
      status: 'completed', 
      invoice: 'НДБ-2025-005' 
    },
    { 
      id: 6, 
      date: '2025-03-18', 
      description: 'Онлайн худалдааны платформ - Үе 2', 
      amount: 6000.00, 
      category: 'Үйлчилгээ', 
      client: 'Акме Корпораци', 
      payment_method: 'Банкны шилжүүлэг', 
      status: 'pending', 
      invoice: 'НДБ-2025-006' 
    },
    { 
      id: 7, 
      date: '2025-03-15', 
      description: 'Бүтээгдэхүүний борлуулалт - Премиум багц', 
      amount: 3500.00, 
      category: 'Бүтээгдэхүүн', 
      client: 'Хувь хүмүүс', 
      payment_method: 'PayPal', 
      status: 'completed', 
      invoice: 'НДБ-2025-007' 
    },
    { 
      id: 8, 
      date: '2025-03-12', 
      description: 'Холбоотой маркетингийн шимтгэл', 
      amount: 750.00, 
      category: 'Холбоотой', 
      client: 'Хувь хүмүүс', 
      payment_method: 'PayPal', 
      status: 'completed', 
      invoice: 'НДБ-2025-008' 
    },
    { 
      id: 9, 
      date: '2025-03-10', 
      description: 'Жилийн засвар үйлчилгээний гэрээ', 
      amount: 4200.00, 
      category: 'Үйлчилгээ', 
      client: 'Вэйн Энтерпрайз', 
      payment_method: 'Банкны шилжүүлэг', 
      status: 'pending', 
      invoice: 'НДБ-2025-009' 
    },
    { 
      id: 10, 
      date: '2025-03-05', 
      description: 'UI/UX Дизайны үйлчилгээ', 
      amount: 2800.00, 
      category: 'Үйлчилгээ', 
      client: 'Старк Индастриз', 
      payment_method: 'Кредит карт', 
      status: 'completed', 
      invoice: 'НДБ-2025-010' 
    },
    { 
      id: 11, 
      date: '2025-03-03', 
      description: 'API интеграцийн төсөл', 
      amount: 3200.00, 
      category: 'Үйлчилгээ', 
      client: 'Глобекс Индастриз', 
      payment_method: 'Банкны шилжүүлэг', 
      status: 'completed', 
      invoice: 'НДБ-2025-011' 
    },
    { 
      id: 12, 
      date: '2025-03-01', 
      description: 'Онлайн семинарын тасалбар', 
      amount: 980.00, 
      category: 'Бүтээгдэхүүн', 
      client: 'Хувь хүмүүс', 
      payment_method: 'PayPal', 
      status: 'cancelled', 
      invoice: 'НДБ-2025-012' 
    },
  ]);
  
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueClients, setUniqueClients] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [stats, setStats] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    averageAmount: 0,
    pendingCount: 0,
    percentChange: 10.5, // Sample percentage change
    topClient: '',
    topClientAmount: 0
  });
  const [currentRevenue, setCurrentRevenue] = useState<Revenue>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: '',
    client: '',
    payment_method: '',
    status: 'pending',
    invoice: '',
    notes: ''
  });
  
  // Constants
  const ITEMS_PER_PAGE = 10;
  
  // Extract unique categories and clients from revenues
  useEffect(() => {
    const categories = [...new Set(allRevenues.map(revenue => revenue.category))].filter(Boolean);
    setUniqueCategories(categories);
    
    const clients = [...new Set(allRevenues.map(revenue => revenue.client))].filter(Boolean);
    setUniqueClients(clients);
    
    // Process revenues with filtering and sorting
    processRevenues();
  }, [allRevenues, searchQuery, selectedCategories, selectedClients, selectedStatus, dateRange, sortField, sortDirection, currentPage]);
  
  // Process revenues (filtering, sorting, pagination)
  const processRevenues = () => {
    // Apply filters
    let filteredRevenues = [...allRevenues];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredRevenues = filteredRevenues.filter(revenue => 
        revenue.description.toLowerCase().includes(query) ||
        revenue.category.toLowerCase().includes(query) ||
        revenue.client.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      filteredRevenues = filteredRevenues.filter(revenue => 
        selectedCategories.includes(revenue.category)
      );
    }
    
    // Client filter
    if (selectedClients.length > 0) {
      filteredRevenues = filteredRevenues.filter(revenue => 
        selectedClients.includes(revenue.client)
      );
    }
    
    // Status filter
    if (selectedStatus.length > 0) {
      filteredRevenues = filteredRevenues.filter(revenue => 
        selectedStatus.includes(revenue.status)
      );
    }
    
    // Date range filter
    if (dateRange.startDate) {
      filteredRevenues = filteredRevenues.filter(revenue => 
        new Date(revenue.date) >= new Date(dateRange.startDate)
      );
    }
    
    if (dateRange.endDate) {
      filteredRevenues = filteredRevenues.filter(revenue => 
        new Date(revenue.date) <= new Date(dateRange.endDate)
      );
    }
    
    // Apply sorting
    filteredRevenues.sort((a, b) => {
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
    
    // Calculate stats based on filtered data
    calculateStats(filteredRevenues);
    
    // Set total count and pages
    const totalItems = filteredRevenues.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    setTotalCount(totalItems);
    setTotalPages(Math.max(1, totalPages));
    
    // Apply pagination
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedRevenues = filteredRevenues.slice(start, end);
    
    setRevenues(paginatedRevenues);
  };
  
  // Calculate statistics from revenue data
  const calculateStats = (filteredRevenues: Revenue[]) => {
    const totalAmount = filteredRevenues.reduce((sum, revenue) => sum + revenue.amount, 0);
    const pendingRevenues = filteredRevenues.filter(revenue => revenue.status === 'pending');
    const pendingAmount = pendingRevenues.reduce((sum, revenue) => sum + revenue.amount, 0);
    const averageAmount = filteredRevenues.length > 0 ? totalAmount / filteredRevenues.length : 0;
    
    // Calculate top client
    const revenueByClient = filteredRevenues.reduce((acc: Record<string, number>, rev) => {
      const client = rev.client;
      if (!acc[client]) acc[client] = 0;
      acc[client] += rev.amount;
      return acc;
    }, {});
    
    let topClient = '';
    let topClientAmount = 0;
    
    Object.entries(revenueByClient).forEach(([client, amount]) => {
      if (amount > topClientAmount) {
        topClient = client;
        topClientAmount = amount;
      }
    });
    
    setStats({
      totalAmount,
      pendingAmount,
      averageAmount,
      pendingCount: pendingRevenues.length,
      percentChange: 10.5, // Sample percentage change
      topClient,
      topClientAmount
    });
  };
  
  // Form handlers
  const handleAddRevenue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const revenue: Revenue = {
      id: allRevenues.length > 0 ? Math.max(...allRevenues.map(r => r.id || 0)) + 1 : 1,
      date: formData.get('revenue-date') as string,
      description: formData.get('revenue-description') as string,
      amount: parseFloat(formData.get('revenue-amount') as string),
      category: formData.get('revenue-category') as string,
      client: formData.get('revenue-client') as string,
      payment_method: formData.get('revenue-payment-method') as string,
      status: formData.get('revenue-status') as 'pending' | 'completed' | 'cancelled',
      invoice: formData.get('revenue-invoice') as string,
      notes: formData.get('revenue-notes') as string
    };
    
    setAllRevenues(prev => [...prev, revenue]);
    setIsAddModalOpen(false);
    toast.success('Revenue added successfully');
  };
  
  const handleUpdateRevenue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const revenueId = parseInt(formData.get('revenue-id') as string);
    
    const revenue: Revenue = {
      id: revenueId,
      date: formData.get('revenue-date') as string,
      description: formData.get('revenue-description') as string,
      amount: parseFloat(formData.get('revenue-amount') as string),
      category: formData.get('revenue-category') as string,
      client: formData.get('revenue-client') as string,
      payment_method: formData.get('revenue-payment-method') as string,
      status: formData.get('revenue-status') as 'pending' | 'completed' | 'cancelled',
      invoice: formData.get('revenue-invoice') as string,
      notes: formData.get('revenue-notes') as string
    };
    
    setAllRevenues(prev => prev.map(r => r.id === revenueId ? revenue : r));
    setIsEditModalOpen(false);
    toast.success('Revenue updated successfully');
  };
  
  const handleDeleteRevenue = (revenueId: number) => {
    setAllRevenues(prev => prev.filter(r => r.id !== revenueId));
    toast.success('Revenue deleted successfully');
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
  
  // Edit revenue
  const handleEditClick = (revenue: Revenue) => {
    setCurrentRevenue(revenue);
    setIsEditModalOpen(true);
  };
  
  // Delete revenue
  const handleDeleteClick = (revenue: Revenue) => {
    setCurrentRevenue(revenue);
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
  
  // Client selection handler for filtering
  const handleClientSelect = (client: string) => {
    setSelectedClients(prev => {
      if (prev.includes(client)) {
        return prev.filter(c => c !== client);
      }
      return [...prev, client];
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
    setSelectedClients([]);
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
    return allRevenues.filter(e => e.category === category).length;
  };
  
  // Get client counts for filtering
  const getClientCount = (client: string): number => {
    return allRevenues.filter(e => e.client === client).length;
  };
  
  // Get status counts
  const getStatusCount = (status: string): number => {
    return allRevenues.filter(e => e.status === status).length;
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
            <h1 className="text-2xl font-semibold">Орлого</h1>
            <p className="mt-1 text-indigo-100">Бизнесийнхээ орлогын эх үүсвэрүүдийг хянах, удирдах</p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Нийт орлого</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${stats.percentChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stats.percentChange >= 0 ? '+' : ''}{stats.percentChange.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-2">өмнөх сараас</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Хүлээгдэж буй орлого</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">${stats.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">{stats.pendingCount} хүлээгдэж буй нэхэмжлэх</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Шилдэг харилцагч</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">
                    {stats.topClient}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">${stats.topClientAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                  placeholder="Орлогуудыг хайх..."
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
                  Шүүлтүүр
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Орлого нэмэх
                </button>
              </div>
            </div>
            
            {/* Filter Panel */}
            {isFiltersOpen && (
              <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50">
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
                  
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Ангилал</h3>
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
                  
                  {/* Client Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Харилцагчид</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {uniqueClients.map(client => (
                        <div key={client} className="flex items-center">
                          <input
                            id={`client-${client}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedClients.includes(client)}
                            onChange={() => handleClientSelect(client)}
                          />
                          <label htmlFor={`client-${client}`} className="ml-2 block text-sm text-gray-700">
                            {client} 
                            <span className="ml-1 text-xs text-gray-500">({getClientCount(client)})</span>
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
                            {status === 'pending' && 'Хүлээгдэж буй'}
                            {status === 'completed' && 'Дууссан'}
                            {status === 'cancelled' && 'Цуцлагдсан'}
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
                    Шүүлтүүр цэвэрлэх
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Шүүлтүүр хэрэглэх
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Revenues Table */}
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
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
                  {revenues.length > 0 ? (
                    revenues.map((revenue, index) => (
                      <tr key={revenue.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColorMap[getCategoryColor(revenue.category)]}`}>
                            {revenue.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[revenue.status]}`}>
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
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 hover:bg-indigo-50 rounded"
                            onClick={() => handleEditClick(revenue)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-rose-600 hover:text-rose-900 p-1 hover:bg-rose-50 rounded"
                            onClick={() => handleDeleteClick(revenue)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                        Таны шүүлтүүрт тохирох орлого олдсонгүй
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
      
      {/* Add Revenue Modal */}
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
              <h3 className="text-lg leading-6 font-medium text-white">Шинэ орлого нэмэх</h3>
            </div>
            
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <form onSubmit={handleAddRevenue} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="revenue-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Огноо
                    </label>
                    <input
                      type="date"
                      id="revenue-date"
                      name="revenue-date"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required
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
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
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
                    placeholder="Орлогын тайлбарыг оруулна уу"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="revenue-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Ангилал
                    </label>
                    <input
                      type="text"
                      id="revenue-category"
                      name="revenue-category"
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
                    <label htmlFor="revenue-client" className="block text-sm font-medium text-gray-700 mb-1">
                      Харилцагч
                    </label>
                    <input
                      type="text"
                      id="revenue-client"
                      name="revenue-client"
                      placeholder="Харилцагч оруулна уу"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      list="client-suggestions"
                      required
                    />
                    <datalist id="client-suggestions">
                      {uniqueClients.map(client => (
                        <option key={client} value={client} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="revenue-payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                      Төлбөрийн хэлбэр
                    </label>
                    <select
                      id="revenue-payment-method"
                      name="revenue-payment-method"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
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
                  <div>
                    <label htmlFor="revenue-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Төлөв
                    </label>
                    <select
                      id="revenue-status"
                      name="revenue-status"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    >
                      <option value="completed">Дууссан</option>
                      <option value="pending">Хүлээгдэж буй</option>
                      <option value="cancelled">Цуцлагдсан</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="revenue-invoice" className="block text-sm font-medium text-gray-700 mb-1">
                    Нэхэмжлэлийн дугаар
                  </label>
                  <input
                    type="text"
                    id="revenue-invoice"
                    name="revenue-invoice"
                    placeholder="ж.нь. НДБ-2025-001"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="revenue-notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Тэмдэглэл (Сонголттой)
                  </label>
                  <textarea
                    id="revenue-notes"
                    name="revenue-notes"
                    rows={3}
                    placeholder="Энэ орлогын талаар нэмэлт мэдээлэл оруулна уу"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <SubmitButton text="Орлого хадгалах" />
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
      
      {/* Edit Revenue Modal */}
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
              <h3 className="text-lg leading-6 font-medium text-white">Орлогыг засах</h3>
            </div>
            
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <form onSubmit={handleUpdateRevenue} className="space-y-4">
                <input type="hidden" name="revenue-id" value={currentRevenue.id} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="revenue-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Огноо
                    </label>
                    <input
                      type="date"
                      id="revenue-date"
                      name="revenue-date"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentRevenue.date}
                      required
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
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentRevenue.amount}
                      required
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
                    placeholder="Орлогын тайлбарыг оруулна уу"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={currentRevenue.description}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="revenue-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Ангилал
                    </label>
                    <input
                      type="text"
                      id="revenue-category"
                      name="revenue-category"
                      placeholder="Ангилал оруулна уу"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentRevenue.category}
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
                    <label htmlFor="revenue-client" className="block text-sm font-medium text-gray-700 mb-1">
                      Харилцагч
                    </label>
                    <input
                      type="text"
                      id="revenue-client"
                      name="revenue-client"
                      placeholder="Харилцагч оруулна уу"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentRevenue.client}
                      list="client-suggestions-edit"
                      required
                    />
                    <datalist id="client-suggestions-edit">
                      {uniqueClients.map(client => (
                        <option key={client} value={client} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="revenue-payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                      Төлбөрийн хэлбэр
                    </label>
                    <select
                      id="revenue-payment-method"
                      name="revenue-payment-method"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentRevenue.payment_method}
                      required
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
                  <div>
                    <label htmlFor="revenue-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Төлөв
                    </label>
                    <select
                      id="revenue-status"
                      name="revenue-status"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={currentRevenue.status}
                      required
                    >
                      <option value="completed">Дууссан</option>
                      <option value="pending">Хүлээгдэж буй</option>
                      <option value="cancelled">Цуцлагдсан</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="revenue-invoice" className="block text-sm font-medium text-gray-700 mb-1">
                    Нэхэмжлэлийн дугаар
                  </label>
                  <input
                    type="text"
                    id="revenue-invoice"
                    name="revenue-invoice"
                    placeholder="ж.нь. НДБ-2025-001"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={currentRevenue.invoice}
                  />
                </div>
                
                <div>
                  <label htmlFor="revenue-notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Тэмдэглэл (Сонголттой)
                  </label>
                  <textarea
                    id="revenue-notes"
                    name="revenue-notes"
                    rows={3}
                    placeholder="Энэ орлогын талаар нэмэлт мэдээлэл оруулна уу"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={currentRevenue.notes}
                  />
                </div>
                
                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <SubmitButton text="Орлогыг шинэчлэх" />
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
        onConfirm={handleDeleteRevenue}
        revenueId={currentRevenue.id || 0}
        revenueDescription={currentRevenue.description}
      />
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