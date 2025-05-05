'use client'
// pages/index.tsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Home, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  FileText, 
  Settings, 
  Bell, 
  Menu, 
  X
} from 'lucide-react';
import Profile from './(components)/profile';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
}

export default function Dashboard(): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Sample data for the chart
  const chartData: ChartDataPoint[] = [
    { month: 'Oct', income: 10200, expenses: 8300 },
    { month: 'Nov', income: 11500, expenses: 9100 },
    { month: 'Dec', income: 13800, expenses: 10500 },
    { month: 'Jan', income: 11200, expenses: 9400 },
    { month: 'Feb', income: 12100, expenses: 9700 },
    { month: 'Mar', income: 12345, expenses: 9876 },
  ];

  // Sample data for recent transactions
  const recentTransactions: Transaction[] = [
    { id: 1, date: '2025-03-28', description: 'Харилцагчийн төлбөр - XYZ Корпораци', amount: 3500, category: 'Орлого', type: 'income' },
    { id: 2, date: '2025-03-27', description: 'Оффисын хэрэгсэл', amount: -250, category: 'Оффис', type: 'expense' },
    { id: 3, date: '2025-03-25', description: 'Программ хангамжийн захиалга', amount: -89, category: 'Программ хангамж', type: 'expense' },
    { id: 4, date: '2025-03-22', description: 'Харилцагчийн төлбөр - ABC ХХК', amount: 2800, category: 'Орлого', type: 'income' },
    { id: 5, date: '2025-03-20', description: 'Ашиглалтын зардал', amount: -175, category: 'Ашиглалтын зардал', type: 'expense' },
];

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
          <NavItem icon={<Home className="w-5 h-5" />} text="Хяналтын самбар" active={true} whichPage='dashboard'/>
          <NavItem icon={<CreditCard className="w-5 h-5" />} text="Зарлагууд" active={false} whichPage='expenses'/>
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

            <div className="flex items-center ml-auto space-x-4">
              <Profile />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Хяналтын самбар</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Income" 
              amount="$12,345" 
              change="+8.1%" 
              isPositive={true} 
              icon={<DollarSign className="w-6 h-6 text-green-500" />}
              color="green"
            />
            <StatCard 
              title="Total Expenses" 
              amount="$9,876" 
              change="+2.3%" 
              isPositive={false} 
              icon={<CreditCard className="w-6 h-6 text-red-500" />}
              color="red"
            />
            <StatCard 
              title="Net Profit" 
              amount="$2,469" 
              change="+14.2%" 
              isPositive={true} 
              icon={<PieChart className="w-6 h-6 text-blue-500" />}
              color="blue"
            />
          </div>
          
          {/* Chart Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Санхүүгийн тойм</h2>
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>Year to date</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#4F46E5" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Сүүлийн гүйлгээ</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">Бүгдийг харах</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Огноо</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тайлбар</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ангилал</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дүн</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
  whichPage: string
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

interface StatCardProps {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, amount, change, isPositive, icon, color }: StatCardProps): React.JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{amount}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-2">өнгөрсөн сараас</span>
        </div>
    </div>
  );
}