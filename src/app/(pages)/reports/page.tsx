'use client'
// pages/reports.tsx
import React, { useState } from 'react';
import Profile from '@/(components)/Profile';

import { 
  Home, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  FileText, 
  Menu, 
  X,
  Calendar,
  Download,
  Printer,
  Share2,
  BarChart2,
  TrendingUp,
  Activity,
  RefreshCw,
  Clock
} from 'lucide-react';

// Types
interface DateRange {
  startDate: string;
  endDate: string;
}

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ReportPeriod {
  id: string;
  name: string;
  description: string;
}

// Strongly typed report data interfaces
interface ReportData {
  type: string;
  title: string;
  dateRange: string;
  generatedAt: string;
  data: ReportDataContent;
}

// Union type for all report data content types
type ReportDataContent = 
  | IncomeStatementData 
  | BalanceSheetData 
  | CashFlowData 
  | ExpenseReportData 
  | RevenueReportData;

interface IncomeStatementData {
  revenue: Record<string, number>;
  expenses: Record<string, number>;
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    marginPercentage: number;
  };
}

interface BalanceSheetData {
  assets: {
    current: Record<string, number>;
    fixed: Record<string, number>;
  };
  liabilities: {
    current: Record<string, number>;
    longTerm: Record<string, number>;
  };
  equity: Record<string, number>;
  summary: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
  };
}

interface CashFlowData {
  operating: Record<string, number>;
  investing: Record<string, number>;
  financing: Record<string, number>;
  summary: {
    netCashIncrease: number;
    beginningCashBalance: number;
    endingCashBalance: number;
  };
}

interface ExpenseReportData {
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  total: number;
}

interface RevenueReportData {
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  total: number;
}

// Sample data with the correct types
const incomeStatementData: IncomeStatementData = {
  revenue: {
    services: 39000,
    products: 6230,
    subscriptions: 2500,
    consulting: 1800,
    other: 750
  },
  expenses: {
    salaries: 15000,
    rent: 1500,
    utilities: 500,
    software: 300,
    marketing: 350,
    office: 200,
    travel: 450,
    other: 180
  },
  summary: {
    totalRevenue: 50280,
    totalExpenses: 18480,
    netIncome: 31800,
    marginPercentage: 63.2
  }
};

const balanceSheetData: BalanceSheetData = {
  assets: {
    current: {
      cash: 42500,
      accountsReceivable: 7500,
      inventory: 3200,
      prepaidExpenses: 1200
    },
    fixed: {
      equipment: 12000,
      furniture: 5000,
      vehicles: 15000,
      accumulatedDepreciation: -6000
    }
  },
  liabilities: {
    current: {
      accountsPayable: 4500,
      shortTermLoans: 5000,
      accruedExpenses: 1800
    },
    longTerm: {
      loans: 15000,
      leases: 3000
    }
  },
  equity: {
    ownersCapital: 45000,
    retainedEarnings: 6100
  },
  summary: {
    totalAssets: 80400,
    totalLiabilities: 29300,
    totalEquity: 51100
  }
};

const cashFlowData: CashFlowData = {
  operating: {
    netIncome: 31800,
    depreciation: 1200,
    accountsReceivableChange: -1500,
    inventoryChange: 200,
    accountsPayableChange: 800,
    netCashFromOperating: 32500
  },
  investing: {
    purchaseOfEquipment: -3000,
    saleOfAssets: 500,
    netCashFromInvesting: -2500
  },
  financing: {
    loanRepayments: -1500,
    ownerContributions: 0,
    dividendsPaid: -5000,
    netCashFromFinancing: -6500
  },
  summary: {
    netCashIncrease: 23500,
    beginningCashBalance: 19000,
    endingCashBalance: 42500
  }
};

const expenseReportData: ExpenseReportData = {
  categories: [
    { name: 'Цалин хөлс', amount: 15000, percentage: 81.2 },
    { name: 'Түрээс', amount: 1500, percentage: 8.1 },
    { name: 'Коммунал', amount: 500, percentage: 2.7 },
    { name: 'Програм хангамж', amount: 300, percentage: 1.6 },
    { name: 'Маркетинг', amount: 350, percentage: 1.9 },
    { name: 'Оффисын хэрэгсэл', amount: 200, percentage: 1.1 },
    { name: 'Томилолт', amount: 450, percentage: 2.4 },
    { name: 'Бусад', amount: 180, percentage: 1.0 }
  ],
  total: 18480
};

const revenueReportData: RevenueReportData = {
  categories: [
    { name: 'Үйлчилгээ', amount: 39000, percentage: 77.6 },
    { name: 'Бүтээгдэхүүн', amount: 6230, percentage: 12.4 },
    { name: 'Захиалга', amount: 2500, percentage: 5.0 },
    { name: 'Зөвлөгөө', amount: 1800, percentage: 3.6 },
    { name: 'Бусад', amount: 750, percentage: 1.5 }
  ],
  total: 50280
};

export default function ReportsPage(): React.JSX.Element {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('income-statement');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('custom');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  
  // Report Types
  const reportTypes: ReportType[] = [
    { 
      id: 'income-statement', 
      name: 'Орлогын тайлан', 
      description: 'Орлого, зардал, ашгийг тодорхой хугацаанд харуулна',
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />
    },
    { 
      id: 'balance-sheet', 
      name: 'Балансын тайлан', 
      description: 'Хөрөнгө, өр төлбөр, өөрийн хөрөнгийг тодорхой цэг дээр харуулна',
      icon: <BarChart2 className="w-6 h-6 text-indigo-500" />
    },
    { 
      id: 'cash-flow', 
      name: 'Мөнгөн урсгалын тайлан', 
      description: 'Үйл ажиллагаа, хөрөнгө оруулалт, санхүүгийн мөнгөн урсгалыг харуулна',
      icon: <Activity className="w-6 h-6 text-green-500" />
    },
    { 
      id: 'expense-report', 
      name: 'Зардлын тайлан', 
      description: 'Бүх зардлын дэлгэрэнгүй задаргаа ангилал тус бүрээр',
      icon: <CreditCard className="w-6 h-6 text-red-500" />
    },
    { 
      id: 'revenue-report', 
      name: 'Орлогын дэлгэрэнгүй тайлан', 
      description: 'Бүх орлогын дэлгэрэнгүй задаргаа эх үүсвэр тус бүрээр',
      icon: <DollarSign className="w-6 h-6 text-green-500" />
    }
  ];
  
  // Report Periods
  const reportPeriods: ReportPeriod[] = [
    { id: 'current-month', name: 'Энэ сар', description: 'Одоогийн сарын эхнээс өнөөдөр хүртэл' },
    { id: 'previous-month', name: 'Өмнөх сар', description: 'Өнгөрсөн сар' },
    { id: 'quarter-to-date', name: 'Улирлын эхнээс', description: 'Одоогийн улирал' },
    { id: 'year-to-date', name: 'Оны эхнээс', description: 'Энэ оны эхнээс өнөөдөр хүртэл' },
    { id: 'last-year', name: 'Өнгөрсөн жил', description: 'Өмнөх санхүүгийн жил' },
    { id: 'custom', name: 'Тусгай хугацаа', description: 'Эхлэл ба төгсгөлийн огноог сонгоно уу' }
  ];
  
  // Handle report generation
  const generateReport = () => {
    // In a real app, this would make an API call to fetch the report data
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      let reportData: ReportDataContent;
      
      // Return different data based on report type
      switch (selectedReportType) {
        case 'income-statement':
          reportData = incomeStatementData;
          break;
        case 'balance-sheet':
          reportData = balanceSheetData;
          break;
        case 'cash-flow':
          reportData = cashFlowData;
          break;
        case 'expense-report':
          reportData = expenseReportData;
          break;
        case 'revenue-report':
          reportData = revenueReportData;
          break;
        default:
          reportData = incomeStatementData;
      }
      
      // Format dates for display
      const startFormatted = new Date(dateRange.startDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      const endFormatted = new Date(dateRange.endDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Create the report object
      const report: ReportData = {
        type: selectedReportType,
        title: reportTypes.find(type => type.id === selectedReportType)?.name || '',
        dateRange: `${startFormatted} - ${endFormatted}`,
        generatedAt: new Date().toLocaleString(),
        data: reportData
      };
      
      setGeneratedReport(report);
      setIsGenerating(false);
      setShowFilters(false);
    }, 1500); // Simulate a 1.5 second delay
  };
  
  // Handle preset period selection
  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId);
    
    const today = new Date();
    let startDate = new Date();
    let endDate = today;
    
    switch (periodId) {
      case 'current-month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'previous-month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'quarter-to-date':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case 'year-to-date':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case 'last-year':
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      // For custom, keep the existing dates
      case 'custom':
        return;
    }
    
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };
  
  // Reset the view to show filters
  const handleNewReport = () => {
    setShowFilters(true);
    setGeneratedReport(null);
  };
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    return '$' + value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Render appropriate report based on type
  const renderReport = () => {
    if (!generatedReport) return null;
    
    switch (generatedReport.type) {
      case 'income-statement':
        return renderIncomeStatement();
      case 'balance-sheet':
        return renderBalanceSheet();
      case 'cash-flow':
        return renderCashFlow();
      case 'expense-report':
        return renderExpenseReport();
      case 'revenue-report':
        return renderRevenueReport();
      default:
        return <div>Тайлангийн төрөл дэмжигдэхгүй байна</div>;
    }
  };
  
  // Render Income Statement
  const renderIncomeStatement = () => {
    if (!generatedReport || !generatedReport.data) return null;
    const data = generatedReport.data as IncomeStatementData;
    
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Орлого</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ангилал</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.revenue).map(([category, amount]) => (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {category === 'services' && 'Үйлчилгээ'}
                        {category === 'products' && 'Бүтээгдэхүүн'}
                        {category === 'subscriptions' && 'Захиалга'}
                        {category === 'consulting' && 'Зөвлөгөө'}
                        {category === 'other' && 'Бусад'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт орлого</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.summary.totalRevenue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Зардал</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ангилал</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.expenses).map(([category, amount]) => (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {category === 'salaries' && 'Цалин хөлс'}
                        {category === 'rent' && 'Түрээс'}
                        {category === 'utilities' && 'Коммунал'}
                        {category === 'software' && 'Програм хангамж'}
                        {category === 'marketing' && 'Маркетинг'}
                        {category === 'office' && 'Оффис'}
                        {category === 'travel' && 'Томилолт'}
                        {category === 'other' && 'Бусад'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт зардал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.summary.totalExpenses)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Нэгтгэл</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт орлого</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-bold">{formatCurrency(data.summary.totalRevenue)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт зардал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-bold">{formatCurrency(data.summary.totalExpenses)}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900">Цэвэр ашиг</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-right font-bold text-blue-600">{formatCurrency(data.summary.netIncome)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ашгийн хувь</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{data.summary.marginPercentage.toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  // Render Balance Sheet
  const renderBalanceSheet = () => {
    if (!generatedReport || !generatedReport.data) return null;
    const data = generatedReport.data as BalanceSheetData;
    
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Хөрөнгө</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ангилал</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Эргэлтийн хөрөнгө</td>
                  </tr>
                  {Object.entries(data.assets.current).map(([asset, amount]) => (
                    <tr key={asset}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize pl-8">
                        {asset === 'cash' && 'Бэлэн мөнгө'}
                        {asset === 'accountsReceivable' && 'Авлага'}
                        {asset === 'inventory' && 'Бараа материал'}
                        {asset === 'prepaidExpenses' && 'Урьдчилж төлсөн зардал'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                    </tr>
                  ))}
                  
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Үндсэн хөрөнгө</td>
                  </tr>
                  {Object.entries(data.assets.fixed).map(([asset, amount]) => (
                    <tr key={asset}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize pl-8">
                        {asset === 'equipment' && 'Тоног төхөөрөмж'}
                        {asset === 'furniture' && 'Тавилга'}
                        {asset === 'vehicles' && 'Тээврийн хэрэгсэл'}
                        {asset === 'accumulatedDepreciation' && 'Хуримтлагдсан элэгдэл'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                    </tr>
                  ))}
                  
                  <tr className="bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт хөрөнгө</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.summary.totalAssets)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Өр төлбөр & Өөрийн хөрөнгө</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ангилал</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Богино хугацаат өр төлбөр</td>
                  </tr>
                  {Object.entries(data.liabilities.current).map(([liability, amount]) => (
                    <tr key={liability}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize pl-8">
                        {liability === 'accountsPayable' && 'Өглөг'}
                        {liability === 'shortTermLoans' && 'Богино хугацаат зээл'}
                        {liability === 'accruedExpenses' && 'Хуримтлагдсан зардал'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                    </tr>
                  ))}
                  
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Урт хугацаат өр төлбөр</td>
                  </tr>
                  {Object.entries(data.liabilities.longTerm).map(([liability, amount]) => (
                    <tr key={liability}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize pl-8">
                        {liability === 'loans' && 'Зээл'}
                        {liability === 'leases' && 'Түрээсийн гэрээ'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                    </tr>
                  ))}
                  
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Өөрийн хөрөнгө</td>
                  </tr>
                  {Object.entries(data.equity).map(([item, amount]) => (
                    <tr key={item}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize pl-8">
                        {item === 'ownersCapital' && 'Эзэмшигчийн хөрөнгө'}
                        {item === 'retainedEarnings' && 'Хуримтлагдсан ашиг'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                    </tr>
                  ))}
                  
                  <tr className="bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт өр төлбөр & өөрийн хөрөнгө</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.summary.totalLiabilities + data.summary.totalEquity)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Нэгтгэл</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт хөрөнгө</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">{formatCurrency(data.summary.totalAssets)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт өр төлбөр</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">{formatCurrency(data.summary.totalLiabilities)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт өөрийн хөрөнгө</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">{formatCurrency(data.summary.totalEquity)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  // Render Cash Flow Statement
  const renderCashFlow = () => {
    if (!generatedReport || !generatedReport.data) return null;
    const data = generatedReport.data as CashFlowData;
    
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Үндсэн үйл ажиллагаа</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үзүүлэлт</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.operating).map(([item, amount]) => (
                    item !== 'netCashFromOperating' ? (
                      <tr key={item}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {item === 'netIncome' && 'Цэвэр ашиг'}
                          {item === 'depreciation' && 'Элэгдэл'}
                          {item === 'accountsReceivableChange' && 'Авлагын өөрчлөлт'}
                          {item === 'inventoryChange' && 'Бараа материалын өөрчлөлт'}
                          {item === 'accountsPayableChange' && 'Өглөгийн өөрчлөлт'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                      </tr>
                    ) : null
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Үндсэн үйл ажиллагааны цэвэр мөнгөн урсгал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.operating.netCashFromOperating)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Хөрөнгө оруулалтын үйл ажиллагаа</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үзүүлэлт</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.investing).map(([item, amount]) => (
                    item !== 'netCashFromInvesting' ? (
                      <tr key={item}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {item === 'purchaseOfEquipment' && 'Тоног төхөөрөмж худалдан авах'}
                          {item === 'saleOfAssets' && 'Хөрөнгө борлуулалт'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                      </tr>
                    ) : null
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Хөрөнгө оруулалтын цэвэр мөнгөн урсгал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.investing.netCashFromInvesting)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Санхүүгийн үйл ажиллагаа</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үзүүлэлт</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(data.financing).map(([item, amount]) => (
                    item !== 'netCashFromFinancing' ? (
                      <tr key={item}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {item === 'loanRepayments' && 'Зээлийн төлбөр'}
                          {item === 'ownerContributions' && 'Эзэмшигчийн хувь нэмэр'}
                          {item === 'dividendsPaid' && 'Тараасан ногдол ашиг'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(amount)}</td>
                      </tr>
                    ) : null
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Санхүүгийн цэвэр мөнгөн урсгал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.financing.netCashFromFinancing)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Нэгтгэл</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Үндсэн үйл ажиллагааны цэвэр мөнгөн урсгал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(data.operating.netCashFromOperating)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Хөрөнгө оруулалтын цэвэр мөнгөн урсгал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(data.investing.netCashFromInvesting)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Санхүүгийн цэвэр мөнгөн урсгал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(data.financing.netCashFromFinancing)}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Мөнгөний цэвэр өсөлт</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.summary.netCashIncrease)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Эхний мөнгөний үлдэгдэл</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(data.summary.beginningCashBalance)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Эцсийн мөнгөний үлдэгдэл</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.summary.endingCashBalance)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  // Render Expense Report
  const renderExpenseReport = () => {
    if (!generatedReport || !generatedReport.data) return null;
    const data = generatedReport.data as ExpenseReportData;
    
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Зардлын задаргаа</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ангилал</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Хувь</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хуваарилалт</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.categories.map((category) => (
                    <tr key={category.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(category.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{category.percentage.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт зардал</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">100.0%</td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Зардлын хуваарилалт</h3>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Дугуй диаграм энд харагдах байсан</p>
              <p className="text-sm mt-2">Ангилал тус бүрээр зардлын харьцаанг харуулах</p>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  // Render Revenue Report
  const renderRevenueReport = () => {
    if (!generatedReport || !generatedReport.data) return null;
    const data = generatedReport.data as RevenueReportData;
    
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Орлогын задаргаа</h3>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ангилал</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Хувь</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хуваарилалт</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.categories.map((category) => (
                    <tr key={category.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(category.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{category.percentage.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Нийт орлого</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{formatCurrency(data.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">100.0%</td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <section className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Орлогын хуваарилалт</h3>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Дугуй диаграм энд харагдах байсан</p>
              <p className="text-sm mt-2">Ангилал тус бүрээр орлогын харьцаанг харуулах</p>
            </div>
          </div>
        </section>
      </div>
    );
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
          <NavItem icon={<DollarSign className="w-5 h-5" />} text="Орлого" active={false} whichPage='revenue'/>
          <NavItem icon={<PieChart className="w-5 h-5" />} text="Төсөв" active={false} whichPage='budget'/>
          <NavItem icon={<FileText className="w-5 h-5" />} text="Тайлан" active={true} whichPage='reports'/>
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
            <h1 className="text-2xl font-semibold text-gray-800">Санхүүгийн тайлан</h1>
            <p className="text-gray-600 mt-1">Дэлгэрэнгүй санхүүгийн тайланг гаргаж, харах</p>
          </div>
          
          {showFilters ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Тайлан үүсгэх</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Report Type Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Тайлангийн төрөл</h3>
                  <div className="space-y-4">
                    {reportTypes.map((type) => (
                      <div 
                        key={type.id}
                        className={`flex cursor-pointer p-4 rounded-lg border ${
                          selectedReportType === type.id 
                            ? 'bg-blue-50 border-blue-500' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedReportType(type.id)}
                      >
                        <div className="flex-shrink-0">
                          {type.icon}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{type.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Date Range Selection */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Тайлангийн хугацаа</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {reportPeriods.map((period) => (
                        <div 
                          key={period.id}
                          className={`flex items-center cursor-pointer p-3 rounded-lg border ${
                            selectedPeriod === period.id 
                              ? 'bg-blue-50 border-blue-500' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handlePeriodChange(period.id)}
                        >
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{period.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{period.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Date Range Section */}
                  {selectedPeriod === 'custom' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Тусгай хугацаа</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">Эхлэх огноо</label>
                          <input
                            type="date"
                            id="start-date"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">Дуусах огноо</label>
                          <input
                            type="date"
                            id="end-date"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={dateRange.endDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Generate Report Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={generateReport}
                      disabled={isGenerating}
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isGenerating ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Тайлан үүсгэж байна...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Тайлан үүсгэх
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
          {/* Generated Report Display */}
          {generatedReport && !showFilters && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{generatedReport.title}</h2>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{generatedReport.dateRange}</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Үүсгэсэн: {generatedReport.generatedAt}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleNewReport}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Шинэ тайлан
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Printer className="w-4 h-4 mr-1" />
                      Хэвлэх
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Download className="w-4 h-4 mr-1" />
                      Татах
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Share2 className="w-4 h-4 mr-1" />
                      Хуваалцах
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Report Content */}
              {renderReport()}
            </div>
          )}
          
          {/* Empty state when no report is generated or being configured */}
          {!generatedReport && !showFilters && (
            <div className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center justify-center text-center">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">Үүсгэсэн тайлан байхгүй байна</h2>
              <p className="text-gray-500 max-w-md mb-6">Тайлангийн төрөл болон хугацааг сонгож санхүүгийн тайлан үүсгэнэ үү.</p>
              <button
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="w-4 h-4 mr-2" />
                Тайлан үүсгэх
              </button>
            </div>
          )}
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
  if (whichPage === "expenses") link = '/expenses'
  if (whichPage === "budget") link = '/budget'
  if (whichPage === "reports") link = '/reports'
  if (whichPage === "revenue") link = '/revenue'
  if (whichPage === "settings") link = '/settings'
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