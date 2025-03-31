// server.ts - Server Actions for Financial Dashboard
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ==============================================
// Type Definitions
// ==============================================

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  timeZone: string;
  language: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

export interface UserPreferences {
  userId: string;
  darkMode: boolean;
  emailNotifications: boolean;
  browserNotifications: boolean;
  mobileNotifications: boolean;
  budgetAlertThreshold: number;
  lowBalanceAlert: boolean;
  lowBalanceThreshold: number;
}

// Expense Types
export interface Expense {
  id: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  receipt?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseCategory {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
}

// Revenue Types
export interface Revenue {
  id: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  client: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  invoice?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevenueCategory {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  year: number;
  month?: number;
  quarter?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  daysRemaining: number;
  dailyBudget: number;
}

// Report Types
export type ReportType = 'income-statement' | 'balance-sheet' | 'cash-flow' | 'expense-report' | 'revenue-report';

export interface Report {
  id: string;
  userId: string;
  type: ReportType;
  title: string;
  startDate: Date;
  endDate: Date;
  data: Record<string, any>;
  createdAt: Date;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Integration Types
export interface Integration {
  id: string;
  userId: string;
  service: string;
  isConnected: boolean;
  lastSynced?: Date;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search and Filter Types
export interface ExpenseFilter {
  search?: string;
  categories?: string[];
  startDate?: Date;
  endDate?: Date;
  status?: ('pending' | 'completed' | 'cancelled')[];
  minAmount?: number;
  maxAmount?: number;
  paymentMethods?: string[];
}

export interface RevenueFilter {
  search?: string;
  categories?: string[];
  clients?: string[];
  startDate?: Date;
  endDate?: Date;
  status?: ('pending' | 'completed' | 'cancelled')[];
  minAmount?: number;
  maxAmount?: number;
  paymentMethods?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==============================================
// Authentication and User Management Functions
// ==============================================

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    // In a real app, this would verify the session and get the user from the database
    // This is a mock implementation
    const mockUser: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Acme Corp',
      jobTitle: 'Financial Manager',
      timeZone: 'America/New_York',
      language: 'English',
      currency: 'USD',
      createdAt: new Date('2023-03-15'),
      updatedAt: new Date('2025-02-28')
    };
    
    return { success: true, data: mockUser };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, error: 'Failed to get current user' };
  }
}

export async function signIn(email: string, password: string): Promise<ApiResponse<{ user: User; redirectUrl: string }>> {
  try {
    // In a real app, this would authenticate the user credentials
    // and create a session
    
    // This is a mock implementation
    if (email === 'john.doe@example.com' && password === 'password123') {
      const user: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Corp',
        jobTitle: 'Financial Manager',
        timeZone: 'America/New_York',
        language: 'English',
        currency: 'USD',
        createdAt: new Date('2023-03-15'),
        updatedAt: new Date('2025-02-28')
      };
      
      // Set a cookie for the session in a real app
      // cookies().set('session_token', 'mock_token_123', { httpOnly: true, secure: true });
      
      return { 
        success: true, 
        data: { user, redirectUrl: '/dashboard' },
        message: 'Signed in successfully' 
      };
    }
    
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: 'Failed to sign in' };
  }
}

export async function signOut(): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would invalidate the session
    // cookies().delete('session_token');
    
    // Redirect to login page
    redirect('/login');
    
    return { success: true, message: 'Signed out successfully' };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}

export async function updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
  try {
    // In a real app, this would update the user in the database
    
    // This is a mock implementation
    const updatedUser: User = {
      id: '1',
      firstName: userData.firstName || 'John',
      lastName: userData.lastName || 'Doe',
      email: userData.email || 'john.doe@example.com',
      phone: userData.phone || '+1 (555) 123-4567',
      company: userData.company || 'Acme Corp',
      jobTitle: userData.jobTitle || 'Financial Manager',
      timeZone: userData.timeZone || 'America/New_York',
      language: userData.language || 'English',
      currency: userData.currency || 'USD',
      createdAt: new Date('2023-03-15'),
      updatedAt: new Date()
    };
    
    // Revalidate the user profile page
    revalidatePath('/settings');
    
    return { success: true, data: updatedUser, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would verify the current password and update to the new one
    
    // Mock implementation
    if (currentPassword === 'password123') {
      // Password would be hashed and updated in the database
      
      return { success: true, message: 'Password changed successfully' };
    }
    
    return { success: false, error: 'Current password is incorrect' };
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, error: 'Failed to change password' };
  }
}

export async function toggleTwoFactorAuth(enable: boolean): Promise<ApiResponse<{ enabled: boolean }>> {
  try {
    // In a real app, this would enable or disable 2FA for the user
    
    // Mock implementation
    return { 
      success: true, 
      data: { enabled: enable },
      message: enable ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled'
    };
  } catch (error) {
    console.error('Error toggling two-factor auth:', error);
    return { success: false, error: 'Failed to update two-factor authentication' };
  }
}

export async function getUserSessions(): Promise<ApiResponse<UserSession[]>> {
  try {
    // In a real app, this would get the user's active sessions from the database
    
    // Mock implementation
    const sessions: UserSession[] = [
      {
        id: '1',
        userId: '1',
        device: 'Windows PC - Chrome',
        location: 'New York, USA',
        lastActive: new Date(),
        isCurrent: true
      },
      {
        id: '2',
        userId: '1',
        device: 'iPhone 16 - Safari',
        location: 'New York, USA',
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isCurrent: false
      },
      {
        id: '3',
        userId: '1',
        device: 'iPad Pro - Chrome',
        location: 'Boston, USA',
        lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        isCurrent: false
      }
    ];
    
    return { success: true, data: sessions };
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return { success: false, error: 'Failed to get sessions' };
  }
}

export async function terminateSession(sessionId: string): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would invalidate the specific session
    
    // Mock implementation
    // We would delete or mark the session as terminated in the database
    
    revalidatePath('/settings');
    
    return { success: true, message: 'Session terminated successfully' };
  } catch (error) {
    console.error('Error terminating session:', error);
    return { success: false, error: 'Failed to terminate session' };
  }
}

export async function terminateAllOtherSessions(): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would invalidate all sessions except the current one
    
    // Mock implementation
    // We would delete or mark all other sessions as terminated in the database
    
    revalidatePath('/settings');
    
    return { success: true, message: 'All other sessions terminated successfully' };
  } catch (error) {
    console.error('Error terminating other sessions:', error);
    return { success: false, error: 'Failed to terminate other sessions' };
  }
}

// ==============================================
// Expense Management Functions
// ==============================================

export async function getExpenses(
  filter?: ExpenseFilter, 
  pagination?: PaginationParams
): Promise<ApiResponse<PaginatedResult<Expense>>> {
  try {
    // In a real app, this would query the database for expenses
    // based on the filter and pagination parameters
    
    // Mock implementation
    const mockExpenses: Expense[] = [
      {
        id: '1',
        userId: '1',
        date: new Date('2025-03-29'),
        description: 'Office Supplies - Printer Paper',
        amount: 45.99,
        category: 'Office Supplies',
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date('2025-03-29'),
        updatedAt: new Date('2025-03-29')
      },
      {
        id: '2',
        userId: '1',
        date: new Date('2025-03-28'),
        description: 'Adobe Creative Cloud Subscription',
        amount: 52.99,
        category: 'Software',
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date('2025-03-28'),
        updatedAt: new Date('2025-03-28')
      },
      {
        id: '3',
        userId: '1',
        date: new Date('2025-03-25'),
        description: 'Electricity Bill',
        amount: 175.45,
        category: 'Utilities',
        paymentMethod: 'Bank Transfer',
        status: 'completed',
        createdAt: new Date('2025-03-25'),
        updatedAt: new Date('2025-03-25')
      },
      {
        id: '4',
        userId: '1',
        date: new Date('2025-03-22'),
        description: 'Business Lunch - Client Meeting',
        amount: 87.65,
        category: 'Meals',
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date('2025-03-22'),
        updatedAt: new Date('2025-03-22')
      },
      {
        id: '5',
        userId: '1',
        date: new Date('2025-03-20'),
        description: 'Google Workspace Subscription',
        amount: 18.00,
        category: 'Software',
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date('2025-03-20'),
        updatedAt: new Date('2025-03-20')
      },
      {
        id: '6',
        userId: '1',
        date: new Date('2025-03-18'),
        description: 'Office Rent - April',
        amount: 1500.00,
        category: 'Rent',
        paymentMethod: 'Bank Transfer',
        status: 'pending',
        createdAt: new Date('2025-03-18'),
        updatedAt: new Date('2025-03-18')
      },
      {
        id: '7',
        userId: '1',
        date: new Date('2025-03-15'),
        description: 'Facebook Ads',
        amount: 350.00,
        category: 'Marketing',
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date('2025-03-15'),
        updatedAt: new Date('2025-03-15')
      },
      {
        id: '8',
        userId: '1',
        date: new Date('2025-03-12'),
        description: 'New Monitor - Dell 27"',
        amount: 329.99,
        category: 'Hardware',
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date('2025-03-12'),
        updatedAt: new Date('2025-03-12')
      },
      {
        id: '9',
        userId: '1',
        date: new Date('2025-03-10'),
        description: 'Internet Service - April',
        amount: 89.99,
        category: 'Utilities',
        paymentMethod: 'Bank Transfer',
        status: 'pending',
        createdAt: new Date('2025-03-10'),
        updatedAt: new Date('2025-03-10')
      },
      {
        id: '10',
        userId: '1',
        date: new Date('2025-03-05'),
        description: 'Hotel - Business Trip',
        amount: 435.80,
        category: 'Travel',
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date('2025-03-05'),
        updatedAt: new Date('2025-03-05')
      },
      {
        id: '11',
        userId: '1',
        date: new Date('2025-03-05'),
        description: 'Flight Tickets - Business Trip',
        amount: 578.50,
        category: 'Travel',
        paymentMethod: 'Credit Card',
        status: 'completed',
        createdAt: new Date('2025-03-05'),
        updatedAt: new Date('2025-03-05')
      },
      {
        id: '12',
        userId: '1',
        date: new Date('2025-03-02'),
        description: 'Office Cleaning Service',
        amount: 120.00,
        category: 'Office Supplies',
        paymentMethod: 'Bank Transfer',
        status: 'cancelled',
        createdAt: new Date('2025-03-02'),
        updatedAt: new Date('2025-03-02')
      }
    ];
    
    // Apply filters
    let filteredExpenses = [...mockExpenses];
    
    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredExpenses = filteredExpenses.filter(expense => 
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.categories && filter.categories.length > 0) {
        filteredExpenses = filteredExpenses.filter(expense => 
          filter.categories?.includes(expense.category)
        );
      }
      
      if (filter.startDate) {
        filteredExpenses = filteredExpenses.filter(expense => 
          expense.date >= filter.startDate!
        );
      }
      
      if (filter.endDate) {
        filteredExpenses = filteredExpenses.filter(expense => 
          expense.date <= filter.endDate!
        );
      }
      
      if (filter.status && filter.status.length > 0) {
        filteredExpenses = filteredExpenses.filter(expense => 
          filter.status?.includes(expense.status)
        );
      }
      
      if (filter.minAmount !== undefined) {
        filteredExpenses = filteredExpenses.filter(expense => 
          expense.amount >= filter.minAmount!
        );
      }
      
      if (filter.maxAmount !== undefined) {
        filteredExpenses = filteredExpenses.filter(expense => 
          expense.amount <= filter.maxAmount!
        );
      }
      
      if (filter.paymentMethods && filter.paymentMethods.length > 0) {
        filteredExpenses = filteredExpenses.filter(expense => 
          filter.paymentMethods?.includes(expense.paymentMethod)
        );
      }
    }
    
    // Apply sorting
    if (pagination?.sortField) {
      filteredExpenses.sort((a, b) => {
        const aValue = a[pagination.sortField as keyof Expense];
        const bValue = b[pagination.sortField as keyof Expense];
        
        if (aValue < bValue) return pagination.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return pagination.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by date descending
      filteredExpenses.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    
    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);
    
    const result: PaginatedResult<Expense> = {
      items: paginatedExpenses,
      total: filteredExpenses.length,
      page,
      limit,
      totalPages: Math.ceil(filteredExpenses.length / limit)
    };
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting expenses:', error);
    return { success: false, error: 'Failed to get expenses' };
  }
}

export async function getExpenseById(id: string): Promise<ApiResponse<Expense>> {
  try {
    // In a real app, this would get the expense from the database by ID
    
    // Mock implementation
    const expense: Expense = {
      id,
      userId: '1',
      date: new Date('2025-03-29'),
      description: 'Office Supplies - Printer Paper',
      amount: 45.99,
      category: 'Office Supplies',
      paymentMethod: 'Credit Card',
      status: 'completed',
      receipt: 'https://example.com/receipts/receipt-123.pdf',
      notes: 'Purchased printer paper for the office',
      createdAt: new Date('2025-03-29'),
      updatedAt: new Date('2025-03-29')
    };
    
    return { success: true, data: expense };
  } catch (error) {
    console.error('Error getting expense by ID:', error);
    return { success: false, error: 'Failed to get expense' };
  }
}

export async function createExpense(expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Expense>> {
  try {
    // In a real app, this would create a new expense in the database
    
    // Mock implementation
    const newExpense: Expense = {
      id: Math.random().toString(36).substring(2, 15),
      userId: '1',
      ...expenseData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { success: true, data: newExpense, message: 'Expense created successfully' };
  } catch (error) {
    console.error('Error creating expense:', error);
    return { success: false, error: 'Failed to create expense' };
  }
}

export async function updateExpense(id: string, expenseData: Partial<Expense>): Promise<ApiResponse<Expense>> {
  try {
    // In a real app, this would update an expense in the database
    
    // Mock implementation
    const updatedExpense: Expense = {
      id,
      userId: '1',
      date: expenseData.date || new Date(),
      description: expenseData.description || 'Unknown expense',
      amount: expenseData.amount || 0,
      category: expenseData.category || 'Uncategorized',
      paymentMethod: expenseData.paymentMethod || 'Other',
      status: expenseData.status || 'pending',
      receipt: expenseData.receipt,
      notes: expenseData.notes,
      createdAt: new Date('2025-03-29'),
      updatedAt: new Date()
    };
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { success: true, data: updatedExpense, message: 'Expense updated successfully' };
  } catch (error) {
    console.error('Error updating expense:', error);
    return { success: false, error: 'Failed to update expense' };
  }
}

export async function deleteExpense(id: string): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would delete the expense from the database
    
    // Mock implementation
    // We would delete the expense in the database
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { success: true, message: 'Expense deleted successfully' };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, error: 'Failed to delete expense' };
  }
}

export async function getExpenseCategories(): Promise<ApiResponse<ExpenseCategory[]>> {
  try {
    // In a real app, this would get the expense categories from the database
    
    // Mock implementation
    const categories: ExpenseCategory[] = [
      { id: '1', userId: '1', name: 'Office Supplies', color: 'blue', icon: 'Office' },
      { id: '2', userId: '1', name: 'Software', color: 'purple', icon: 'Code' },
      { id: '3', userId: '1', name: 'Utilities', color: 'green', icon: 'Zap' },
      { id: '4', userId: '1', name: 'Travel', color: 'orange', icon: 'Plane' },
      { id: '5', userId: '1', name: 'Marketing', color: 'pink', icon: 'TrendingUp' },
      { id: '6', userId: '1', name: 'Rent', color: 'red', icon: 'Home' },
      { id: '7', userId: '1', name: 'Meals', color: 'yellow', icon: 'Coffee' },
      { id: '8', userId: '1', name: 'Hardware', color: 'indigo', icon: 'Monitor' }
    ];
    
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error getting expense categories:', error);
    return { success: false, error: 'Failed to get expense categories' };
  }
}

export async function createExpenseCategory(categoryData: Omit<ExpenseCategory, 'id' | 'userId'>): Promise<ApiResponse<ExpenseCategory>> {
  try {
    // In a real app, this would create a new expense category in the database
    
    // Mock implementation
    const newCategory: ExpenseCategory = {
      id: Math.random().toString(36).substring(2, 15),
      userId: '1',
      ...categoryData
    };
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { success: true, data: newCategory, message: 'Category created successfully' };
  } catch (error) {
    console.error('Error creating expense category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateExpenseCategory(id: string, categoryData: Partial<ExpenseCategory>): Promise<ApiResponse<ExpenseCategory>> {
  try {
    // In a real app, this would update an expense category in the database
    
    // Mock implementation
    const updatedCategory: ExpenseCategory = {
      id,
      userId: '1',
      name: categoryData.name || 'Unnamed Category',
      color: categoryData.color || 'gray',
      icon: categoryData.icon || 'Square'
    };
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { success: true, data: updatedCategory, message: 'Category updated successfully' };
  } catch (error) {
    console.error('Error updating expense category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteExpenseCategory(id: string): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would delete the expense category from the database
    
    // Mock implementation
    // We would delete the category in the database
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { success: true, message: 'Category deleted successfully' };
  } catch (error) {
    console.error('Error deleting expense category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}

export async function getExpenseSummary(period?: 'daily' | 'weekly' | 'monthly' | 'yearly', date?: Date): Promise<ApiResponse<{ total: number; categories: { name: string; amount: number }[] }>> {
  try {
    // In a real app, this would calculate the expense summary from the database
    
    // Mock implementation
    const summary = {
      total: 3784.36,
      categories: [
        { name: 'Rent', amount: 1500.00 },
        { name: 'Travel', amount: 1014.30 },
        { name: 'Software', amount: 70.99 },
        { name: 'Office Supplies', amount: 165.99 },
        { name: 'Utilities', amount: 265.44 },
        { name: 'Marketing', amount: 350.00 },
        { name: 'Hardware', amount: 329.99 },
        { name: 'Meals', amount: 87.65 }
      ]
    };
    
    return { success: true, data: summary };
  } catch (error) {
    console.error('Error getting expense summary:', error);
    return { success: false, error: 'Failed to get expense summary' };
  }
}

// ==============================================
// Revenue Management Functions
// ==============================================

export async function getRevenues(
  filter?: RevenueFilter, 
  pagination?: PaginationParams
): Promise<ApiResponse<PaginatedResult<Revenue>>> {
  try {
    // In a real app, this would query the database for revenues
    // based on the filter and pagination parameters
    
    // Mock implementation
    const mockRevenues: Revenue[] = [
      {
        id: '1',
        userId: '1',
        date: new Date('2025-03-30'),
        description: 'Website Development Project',
        amount: 5000.00,
        category: 'Services',
        client: 'Acme Corporation',
        paymentMethod: 'Bank Transfer',
        status: 'completed',
        invoice: 'INV-2025-001',
        createdAt: new Date('2025-03-30'),
        updatedAt: new Date('2025-03-30')
      },
      {
        id: '2',
        userId: '1',
        date: new Date('2025-03-28'),
        description: 'Monthly SaaS Subscription - March',
        amount: 2500.00,
        category: 'Subscriptions',
        client: 'Globex Industries',
        paymentMethod: 'Credit Card',
        status: 'completed',
        invoice: 'INV-2025-002',
        createdAt: new Date('2025-03-28'),
        updatedAt: new Date('2025-03-28')
      },
      {
        id: '3',
        userId: '1',
        date: new Date('2025-03-25'),
        description: 'Mobile App Development - Milestone 1',
        amount: 7500.00,
        category: 'Services',
        client: 'Wayne Enterprises',
        paymentMethod: 'Bank Transfer',
        status: 'completed',
        invoice: 'INV-2025-003',
        createdAt: new Date('2025-03-25'),
        updatedAt: new Date('2025-03-25')
      },
      {
        id: '4',
        userId: '1',
        date: new Date('2025-03-22'),
        description: 'Software Licensing Fees',
        amount: 1200.00,
        category: 'Licensing',
        client: 'Stark Industries',
        paymentMethod: 'Credit Card',
        status: 'completed',
        invoice: 'INV-2025-004',
        createdAt: new Date('2025-03-22'),
        updatedAt: new Date('2025-03-22')
      },
      {
        id: '5',
        userId: '1',
        date: new Date('2025-03-20'),
        description: 'Consulting Services - Training',
        amount: 1800.00,
        category: 'Consulting',
        client: 'Globex Industries',
        paymentMethod: 'Bank Transfer',
        status: 'completed',
        invoice: 'INV-2025-005',
        createdAt: new Date('2025-03-20'),
        updatedAt: new Date('2025-03-20')
      },
      {
        id: '6',
        userId: '1',
        date: new Date('2025-03-18'),
        description: 'E-commerce Platform - Phase 2',
        amount: 6000.00,
        category: 'Services',
        client: 'Acme Corporation',
        paymentMethod: 'Bank Transfer',
        status: 'pending',
        invoice: 'INV-2025-006',
        createdAt: new Date('2025-03-18'),
        updatedAt: new Date('2025-03-18')
      },
      {
        id: '7',
        userId: '1',
        date: new Date('2025-03-15'),
        description: 'Product Sales - Premium Package',
        amount: 3500.00,
        category: 'Products',
        client: 'Individual Clients',
        paymentMethod: 'PayPal',
        status: 'completed',
        invoice: 'INV-2025-007',
        createdAt: new Date('2025-03-15'),
        updatedAt: new Date('2025-03-15')
      },
      {
        id: '8',
        userId: '1',
        date: new Date('2025-03-12'),
        description: 'Affiliate Marketing Commission',
        amount: 750.00,
        category: 'Affiliate',
        client: 'Individual Clients',
        paymentMethod: 'PayPal',
        status: 'completed',
        invoice: 'INV-2025-008',
        createdAt: new Date('2025-03-12'),
        updatedAt: new Date('2025-03-12')
      },
      {
        id: '9',
        userId: '1',
        date: new Date('2025-03-10'),
        description: 'Annual Maintenance Contract',
        amount: 4200.00,
        category: 'Services',
        client: 'Wayne Enterprises',
        paymentMethod: 'Bank Transfer',
        status: 'pending',
        invoice: 'INV-2025-009',
        createdAt: new Date('2025-03-10'),
        updatedAt: new Date('2025-03-10')
      },
      {
        id: '10',
        userId: '1',
        date: new Date('2025-03-05'),
        description: 'UI/UX Design Services',
        amount: 2800.00,
        category: 'Services',
        client: 'Stark Industries',
        paymentMethod: 'Credit Card',
        status: 'completed',
        invoice: 'INV-2025-010',
        createdAt: new Date('2025-03-05'),
        updatedAt: new Date('2025-03-05')
      },
      {
        id: '11',
        userId: '1',
        date: new Date('2025-03-03'),
        description: 'API Integration Project',
        amount: 3200.00,
        category: 'Services',
        client: 'Globex Industries',
        paymentMethod: 'Bank Transfer',
        status: 'completed',
        invoice: 'INV-2025-011',
        createdAt: new Date('2025-03-03'),
        updatedAt: new Date('2025-03-03')
      },
      {
        id: '12',
        userId: '1',
        date: new Date('2025-03-01'),
        description: 'Online Workshop Tickets',
        amount: 980.00,
        category: 'Products',
        client: 'Individual Clients',
        paymentMethod: 'PayPal',
        status: 'cancelled',
        invoice: 'INV-2025-012',
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2025-03-01')
      }
    ];
    
    // Apply filters
    let filteredRevenues = [...mockRevenues];
    
    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredRevenues = filteredRevenues.filter(revenue => 
          revenue.description.toLowerCase().includes(searchLower) ||
          revenue.category.toLowerCase().includes(searchLower) ||
          revenue.client.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.categories && filter.categories.length > 0) {
        filteredRevenues = filteredRevenues.filter(revenue => 
          filter.categories?.includes(revenue.category)
        );
      }
      
      if (filter.clients && filter.clients.length > 0) {
        filteredRevenues = filteredRevenues.filter(revenue => 
          filter.clients?.includes(revenue.client)
        );
      }
      
      if (filter.startDate) {
        filteredRevenues = filteredRevenues.filter(revenue => 
          revenue.date >= filter.startDate!
        );
      }
      
      if (filter.endDate) {
        filteredRevenues = filteredRevenues.filter(revenue => 
          revenue.date <= filter.endDate!
        );
      }
      
      if (filter.status && filter.status.length > 0) {
        filteredRevenues = filteredRevenues.filter(revenue => 
          filter.status?.includes(revenue.status)
        );
      }
      
      if (filter.minAmount !== undefined) {
        filteredRevenues = filteredRevenues.filter(revenue => 
          revenue.amount >= filter.minAmount!
        );
      }
      
      if (filter.maxAmount !== undefined) {
        filteredRevenues = filteredRevenues.filter(revenue => 
          revenue.amount <= filter.maxAmount!
        );
      }
      
      if (filter.paymentMethods && filter.paymentMethods.length > 0) {
        filteredRevenues = filteredRevenues.filter(revenue => 
          filter.paymentMethods?.includes(revenue.paymentMethod)
        );
      }
    }
    
    // Apply sorting
    if (pagination?.sortField) {
      filteredRevenues.sort((a, b) => {
        const aValue = a[pagination.sortField as keyof Revenue];
        const bValue = b[pagination.sortField as keyof Revenue];
        
        if (aValue < bValue) return pagination.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return pagination.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by date descending
      filteredRevenues.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    
    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRevenues = filteredRevenues.slice(startIndex, endIndex);
    
    const result: PaginatedResult<Revenue> = {
      items: paginatedRevenues,
      total: filteredRevenues.length,
      page,
      limit,
      totalPages: Math.ceil(filteredRevenues.length / limit)
    };
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting revenues:', error);
    return { success: false, error: 'Failed to get revenues' };
  }
}

export async function getRevenueById(id: string): Promise<ApiResponse<Revenue>> {
  try {
    // In a real app, this would get the revenue from the database by ID
    
    // Mock implementation
    const revenue: Revenue = {
      id,
      userId: '1',
      date: new Date('2025-03-30'),
      description: 'Website Development Project',
      amount: 5000.00,
      category: 'Services',
      client: 'Acme Corporation',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      invoice: 'INV-2025-001',
      notes: 'Full payment for the company website redesign project',
      createdAt: new Date('2025-03-30'),
      updatedAt: new Date('2025-03-30')
    };
    
    return { success: true, data: revenue };
  } catch (error) {
    console.error('Error getting revenue by ID:', error);
    return { success: false, error: 'Failed to get revenue' };
  }
}

export async function createRevenue(revenueData: Omit<Revenue, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Revenue>> {
  try {
    // In a real app, this would create a new revenue in the database
    
    // Mock implementation
    const newRevenue: Revenue = {
      id: Math.random().toString(36).substring(2, 15),
      userId: '1',
      ...revenueData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Revalidate the revenues page
    revalidatePath('/revenue');
    
    return { success: true, data: newRevenue, message: 'Revenue created successfully' };
  } catch (error) {
    console.error('Error creating revenue:', error);
    return { success: false, error: 'Failed to create revenue' };
  }
}

export async function updateRevenue(id: string, revenueData: Partial<Revenue>): Promise<ApiResponse<Revenue>> {
  try {
    // In a real app, this would update a revenue in the database
    
    // Mock implementation
    const updatedRevenue: Revenue = {
      id,
      userId: '1',
      date: revenueData.date || new Date(),
      description: revenueData.description || 'Unknown revenue',
      amount: revenueData.amount || 0,
      category: revenueData.category || 'Uncategorized',
      client: revenueData.client || 'Unknown client',
      paymentMethod: revenueData.paymentMethod || 'Other',
      status: revenueData.status || 'pending',
      invoice: revenueData.invoice,
      notes: revenueData.notes,
      createdAt: new Date('2025-03-30'),
      updatedAt: new Date()
    };
    
    // Revalidate the revenues page
    revalidatePath('/revenue');
    
    return { success: true, data: updatedRevenue, message: 'Revenue updated successfully' };
  } catch (error) {
    console.error('Error updating revenue:', error);
    return { success: false, error: 'Failed to update revenue' };
  }
}

export async function deleteRevenue(id: string): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would delete the revenue from the database
    
    // Mock implementation
    // We would delete the revenue in the database
    
    // Revalidate the revenues page
    revalidatePath('/revenue');
    
    return { success: true, message: 'Revenue deleted successfully' };
  } catch (error) {
    console.error('Error deleting revenue:', error);
    return { success: false, error: 'Failed to delete revenue' };
  }
}

export async function getRevenueCategories(): Promise<ApiResponse<RevenueCategory[]>> {
  try {
    // In a real app, this would get the revenue categories from the database
    
    // Mock implementation
    const categories: RevenueCategory[] = [
      { id: '1', userId: '1', name: 'Services', color: 'green', icon: 'Activity' },
      { id: '2', userId: '1', name: 'Products', color: 'blue', icon: 'Package' },
      { id: '3', userId: '1', name: 'Subscriptions', color: 'purple', icon: 'Calendar' },
      { id: '4', userId: '1', name: 'Consulting', color: 'orange', icon: 'Briefcase' },
      { id: '5', userId: '1', name: 'Licensing', color: 'indigo', icon: 'Key' },
      { id: '6', userId: '1', name: 'Affiliate', color: 'pink', icon: 'Link' },
      { id: '7', userId: '1', name: 'Royalties', color: 'yellow', icon: 'Award' },
      { id: '8', userId: '1', name: 'Other', color: 'gray', icon: 'Circle' }
    ];
    
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error getting revenue categories:', error);
    return { success: false, error: 'Failed to get revenue categories' };
  }
}

export async function getClients(): Promise<ApiResponse<Client[]>> {
  try {
    // In a real app, this would get the clients from the database
    
    // Mock implementation
    const clients: Client[] = [
      { 
        id: '1', 
        userId: '1', 
        name: 'Acme Corporation', 
        company: 'Acme Corp', 
        email: 'billing@acmecorp.com',
        phone: '+1 (555) 123-4567',
        address: '123 Acme St, New York, NY 10001',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2025-02-20')
      },
      { 
        id: '2', 
        userId: '1', 
        name: 'Globex Industries', 
        company: 'Globex', 
        email: 'finance@globex.com',
        phone: '+1 (555) 987-6543',
        address: '456 Globex Ave, Chicago, IL 60601',
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date('2025-01-15')
      },
      { 
        id: '3', 
        userId: '1', 
        name: 'Wayne Enterprises', 
        company: 'Wayne Ent', 
        email: 'accounts@wayne.com',
        phone: '+1 (555) 456-7890',
        address: '789 Wayne Blvd, Gotham, NY 10002',
        createdAt: new Date('2023-05-22'),
        updatedAt: new Date('2024-11-30')
      },
      { 
        id: '4', 
        userId: '1', 
        name: 'Stark Industries', 
        company: 'Stark Inc', 
        email: 'payments@stark.com',
        phone: '+1 (555) 789-0123',
        address: '10880 Malibu Point, Malibu, CA 90265',
        createdAt: new Date('2023-08-05'),
        updatedAt: new Date('2025-03-10')
      },
      { 
        id: '5', 
        userId: '1', 
        name: 'Individual Clients', 
        company: 'Various', 
        email: 'admin@mycompany.com',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ];
    
    return { success: true, data: clients };
  } catch (error) {
    console.error('Error getting clients:', error);
    return { success: false, error: 'Failed to get clients' };
  }
}

export async function createClient(clientData: Omit<Client, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> {
  try {
    // In a real app, this would create a new client in the database
    
    // Mock implementation
    const newClient: Client = {
      id: Math.random().toString(36).substring(2, 15),
      userId: '1',
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Revalidate the clients page
    revalidatePath('/clients');
    
    return { success: true, data: newClient, message: 'Client created successfully' };
  } catch (error) {
    console.error('Error creating client:', error);
    return { success: false, error: 'Failed to create client' };
  }
}

export async function updateClient(id: string, clientData: Partial<Client>): Promise<ApiResponse<Client>> {
  try {
    // In a real app, this would update a client in the database
    
    // Mock implementation
    const updatedClient: Client = {
      id,
      userId: '1',
      name: clientData.name || 'Unknown client',
      company: clientData.company,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date()
    };
    
    // Revalidate the clients page
    revalidatePath('/clients');
    
    return { success: true, data: updatedClient, message: 'Client updated successfully' };
  } catch (error) {
    console.error('Error updating client:', error);
    return { success: false, error: 'Failed to update client' };
  }
}

export async function deleteClient(id: string): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would delete the client from the database
    
    // Mock implementation
    // We would delete the client in the database
    
    // Revalidate the clients page
    revalidatePath('/clients');
    
    return { success: true, message: 'Client deleted successfully' };
  } catch (error) {
    console.error('Error deleting client:', error);
    return { success: false, error: 'Failed to delete client' };
  }
}

export async function getRevenueSummary(period?: 'daily' | 'weekly' | 'monthly' | 'yearly', date?: Date): Promise<ApiResponse<{ total: number; categories: { name: string; amount: number }[] }>> {
  try {
    // In a real app, this would calculate the revenue summary from the database
    
    // Mock implementation
    const summary = {
      total: 39430.00,
      categories: [
        { name: 'Services', amount: 28700.00 },
        { name: 'Subscriptions', amount: 2500.00 },
        { name: 'Products', amount: 4480.00 },
        { name: 'Consulting', amount: 1800.00 },
        { name: 'Licensing', amount: 1200.00 },
        { name: 'Affiliate', amount: 750.00 }
      ]
    };
    
    return { success: true, data: summary };
  } catch (error) {
    console.error('Error getting revenue summary:', error);
    return { success: false, error: 'Failed to get revenue summary' };
  }
}

// ==============================================
// Budget Management Functions
// ==============================================

export async function getBudgets(period: 'monthly' | 'quarterly' | 'yearly', year: number, month?: number, quarter?: number): Promise<ApiResponse<Budget[]>> {
  try {
    // In a real app, this would get the budgets from the database
    // based on the period, year, month, and quarter
    
    // Mock implementation
    const budgets: Budget[] = [
      { id: '1', userId: '1', categoryId: '1', amount: 150, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '2', userId: '1', categoryId: '2', amount: 600, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '3', userId: '1', categoryId: '3', amount: 400, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '4', userId: '1', categoryId: '4', amount: 250, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '5', userId: '1', categoryId: '5', amount: 300, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '6', userId: '1', categoryId: '6', amount: 200, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '7', userId: '1', categoryId: '7', amount: 150, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '8', userId: '1', categoryId: '8', amount: 200, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '9', userId: '1', categoryId: '9', amount: 800, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') },
      { id: '10', userId: '1', categoryId: '10', amount: 100, period: 'monthly', year: 2025, month: 3, createdAt: new Date('2025-02-28'), updatedAt: new Date('2025-02-28') }
    ];
    
    return { success: true, data: budgets };
  } catch (error) {
    console.error('Error getting budgets:', error);
    return { success: false, error: 'Failed to get budgets' };
  }
}

export async function getBudgetCategorySummary(categoryId: string, period: 'monthly' | 'quarterly' | 'yearly', year: number, month?: number, quarter?: number): Promise<ApiResponse<{
  budgetAmount: number;
  actualSpent: number;
  previousPeriodSpent: number;
  transactions: number;
  percentage: number;
}>> {
  try {
    // In a real app, this would calculate the budget category summary from the database
    
    // Mock implementation
    const summary = {
      budgetAmount: 300,
      actualSpent: 354.28,
      previousPeriodSpent: 287.65,
      transactions: 9,
      percentage: 118.09
    };
    
    return { success: true, data: summary };
  } catch (error) {
    console.error('Error getting budget category summary:', error);
    return { success: false, error: 'Failed to get budget category summary' };
  }
}

export async function getBudgetSummary(period: 'monthly' | 'quarterly' | 'yearly', year: number, month?: number, quarter?: number): Promise<ApiResponse<BudgetSummary>> {
  try {
    // In a real app, this would calculate the budget summary from the database
    
    // Mock implementation
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = lastDayOfMonth - today.getDate();
    
    const summary: BudgetSummary = {
      totalBudget: 3150,
      totalSpent: 2211.55,
      remainingBudget: 938.45,
      percentageUsed: 70.21,
      daysRemaining,
      dailyBudget: 938.45 / daysRemaining
    };
    
    return { success: true, data: summary };
  } catch (error) {
    console.error('Error getting budget summary:', error);
    return { success: false, error: 'Failed to get budget summary' };
  }
}

export async function createBudget(budgetData: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Budget>> {
  try {
    // In a real app, this would create a new budget in the database
    
    // Mock implementation
    const newBudget: Budget = {
      id: Math.random().toString(36).substring(2, 15),
      userId: '1',
      ...budgetData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Revalidate the budgets page
    revalidatePath('/budget');
    
    return { success: true, data: newBudget, message: 'Budget created successfully' };
  } catch (error) {
    console.error('Error creating budget:', error);
    return { success: false, error: 'Failed to create budget' };
  }
}

export async function updateBudget(id: string, budgetData: Partial<Budget>): Promise<ApiResponse<Budget>> {
  try {
    // In a real app, this would update a budget in the database
    
    // Mock implementation
    const updatedBudget: Budget = {
      id,
      userId: '1',
      categoryId: budgetData.categoryId || 'unknown',
      amount: budgetData.amount || 0,
      period: budgetData.period || 'monthly',
      year: budgetData.year || 2025,
      month: budgetData.month,
      quarter: budgetData.quarter,
      createdAt: new Date('2025-02-28'),
      updatedAt: new Date()
    };
    
    // Revalidate the budgets page
    revalidatePath('/budget');
    
    return { success: true, data: updatedBudget, message: 'Budget updated successfully' };
  } catch (error) {
    console.error('Error updating budget:', error);
    return { success: false, error: 'Failed to update budget' };
  }
}

export async function deleteBudget(id: string): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would delete the budget from the database
    
    // Mock implementation
    // We would delete the budget in the database
    
    // Revalidate the budgets page
    revalidatePath('/budget');
    
    return { success: true, message: 'Budget deleted successfully' };
  } catch (error) {
    console.error('Error deleting budget:', error);
    return { success: false, error: 'Failed to delete budget' };
  }
}

// ==============================================
// Report Generation Functions
// ==============================================

export async function generateReport(type: ReportType, dateRange: DateRange): Promise<ApiResponse<Report>> {
  try {
    // In a real app, this would generate a report based on the type and date range
    
    // Mock implementation for generating different types of reports
    let reportData: Record<string, any> = {};
    
    switch (type) {
      case 'income-statement':
        reportData = {
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
        break;
      
      case 'balance-sheet':
        reportData = {
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
        break;
      
      case 'cash-flow':
        reportData = {
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
        break;
      
      case 'expense-report':
        reportData = {
          categories: [
            { name: 'Salaries', amount: 15000, percentage: 81.2 },
            { name: 'Rent', amount: 1500, percentage: 8.1 },
            { name: 'Utilities', amount: 500, percentage: 2.7 },
            { name: 'Software', amount: 300, percentage: 1.6 },
            { name: 'Marketing', amount: 350, percentage: 1.9 },
            { name: 'Office Supplies', amount: 200, percentage: 1.1 },
            { name: 'Travel', amount: 450, percentage: 2.4 },
            { name: 'Other', amount: 180, percentage: 1.0 }
          ],
          total: 18480
        };
        break;
      
      case 'revenue-report':
        reportData = {
          categories: [
            { name: 'Services', amount: 39000, percentage: 77.6 },
            { name: 'Products', amount: 6230, percentage: 12.4 },
            { name: 'Subscriptions', amount: 2500, percentage: 5.0 },
            { name: 'Consulting', amount: 1800, percentage: 3.6 },
            { name: 'Other', amount: 750, percentage: 1.5 }
          ],
          total: 50280
        };
        break;
    }
    
    const report: Report = {
      id: Math.random().toString(36).substring(2, 15),
      userId: '1',
      type,
      title: getReportTitle(type),
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      data: reportData,
      createdAt: new Date()
    };
    
    return { success: true, data: report };
  } catch (error) {
    console.error('Error generating report:', error);
    return { success: false, error: 'Failed to generate report' };
  }
}

export async function getSavedReports(): Promise<ApiResponse<Report[]>> {
  try {
    // In a real app, this would get the saved reports from the database
    
    // Mock implementation
    const reports: Report[] = [
      {
        id: '1',
        userId: '1',
        type: 'income-statement',
        title: 'Income Statement',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-31'),
        data: {}, // This would contain the actual report data
        createdAt: new Date('2025-03-31')
      },
      {
        id: '2',
        userId: '1',
        type: 'balance-sheet',
        title: 'Balance Sheet',
        startDate: new Date('2025-03-31'),
        endDate: new Date('2025-03-31'),
        data: {}, // This would contain the actual report data
        createdAt: new Date('2025-03-31')
      },
      {
        id: '3',
        userId: '1',
        type: 'cash-flow',
        title: 'Cash Flow Statement',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-31'),
        data: {}, // This would contain the actual report data
        createdAt: new Date('2025-03-31')
      },
      {
        id: '4',
        userId: '1',
        type: 'expense-report',
        title: 'Expense Report',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-31'),
        data: {}, // This would contain the actual report data
        createdAt: new Date('2025-03-31')
      },
      {
        id: '5',
        userId: '1',
        type: 'revenue-report',
        title: 'Revenue Report',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-31'),
        data: {}, // This would contain the actual report data
        createdAt: new Date('2025-03-31')
      }
    ];
    
    return { success: true, data: reports };
  } catch (error) {
    console.error('Error getting saved reports:', error);
    return { success: false, error: 'Failed to get saved reports' };
  }
}

export async function saveReport(report: Omit<Report, 'id' | 'userId' | 'createdAt'>): Promise<ApiResponse<Report>> {
  try {
    // In a real app, this would save the report to the database
    
    // Mock implementation
    const savedReport: Report = {
      id: Math.random().toString(36).substring(2, 15),
      userId: '1',
      ...report,
      createdAt: new Date()
    };
    
    // Revalidate the reports page
    revalidatePath('/reports');
    
    return { success: true, data: savedReport, message: 'Report saved successfully' };
  } catch (error) {
    console.error('Error saving report:', error);
    return { success: false, error: 'Failed to save report' };
  }
}

export async function deleteReport(id: string): Promise<ApiResponse<null>> {
  try {
    // In a real app, this would delete the report from the database
    
    // Mock implementation
    // We would delete the report in the database
    
    // Revalidate the reports page
    revalidatePath('/reports');
    
    return { success: true, message: 'Report deleted successfully' };
  } catch (error) {
    console.error('Error deleting report:', error);
    return { success: false, error: 'Failed to delete report' };
  }
}

// Helper function to get report title based on type
function getReportTitle(type: ReportType): string {
  switch (type) {
    case 'income-statement':
      return 'Income Statement';
    case 'balance-sheet':
      return 'Balance Sheet';
    case 'cash-flow':
      return 'Cash Flow Statement';
    case 'expense-report':
      return 'Expense Report';
    case 'revenue-report':
      return 'Revenue Report';
    default:
      return 'Financial Report';
  }
}

// ==============================================
// Settings and Integration Functions
// ==============================================

export async function getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
  try {
    // In a real app, this would get the user preferences from the database
    
    // Mock implementation
    const preferences: UserPreferences = {
      userId: '1',
      darkMode: false,
      emailNotifications: true,
      browserNotifications: true,
      mobileNotifications: true,
      budgetAlertThreshold: 80,
      lowBalanceAlert: true,
      lowBalanceThreshold: 500
    };
    
    return { success: true, data: preferences };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return { success: false, error: 'Failed to get user preferences' };
  }
}

export async function updateUserPreferences(preferencesData: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
  try {
    // In a real app, this would update the user preferences in the database
    
    // Mock implementation
    const updatedPreferences: UserPreferences = {
      userId: '1',
      darkMode: preferencesData.darkMode ?? false,
      emailNotifications: preferencesData.emailNotifications ?? true,
      browserNotifications: preferencesData.browserNotifications ?? true,
      mobileNotifications: preferencesData.mobileNotifications ?? true,
      budgetAlertThreshold: preferencesData.budgetAlertThreshold ?? 80,
      lowBalanceAlert: preferencesData.lowBalanceAlert ?? true,
      lowBalanceThreshold: preferencesData.lowBalanceThreshold ?? 500
    };
    
    // Revalidate the settings page
    revalidatePath('/settings');
    
    return { success: true, data: updatedPreferences, message: 'Preferences updated successfully' };
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return { success: false, error: 'Failed to update preferences' };
  }
}

export async function getIntegrations(): Promise<ApiResponse<Integration[]>> {
  try {
    // In a real app, this would get the integrations from the database
    
    // Mock implementation
    const integrations: Integration[] = [
      { 
        id: '1', 
        userId: '1', 
        service: 'quickbooks', 
        isConnected: true, 
        lastSynced: new Date('2025-03-28T14:30:00'),
        metadata: { company_id: 'qb123456' },
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2025-03-28')
      },
      { 
        id: '2', 
        userId: '1', 
        service: 'stripe', 
        isConnected: true, 
        lastSynced: new Date('2025-03-29T09:15:00'),
        metadata: { account_id: 'acct_12345' },
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2025-03-29')
      },
      { 
        id: '3', 
        userId: '1', 
        service: 'paypal', 
        isConnected: false,
        createdAt: new Date('2024-12-05'),
        updatedAt: new Date('2024-12-05')
      },
      { 
        id: '4', 
        userId: '1', 
        service: 'xero', 
        isConnected: false,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-10')
      },
      { 
        id: '5', 
        userId: '1', 
        service: 'bank', 
        isConnected: true, 
        lastSynced: new Date('2025-03-30T08:45:00'),
        metadata: { institution: 'Chase', accounts: ['checking', 'savings'] },
        createdAt: new Date('2025-02-18'),
        updatedAt: new Date('2025-03-30')
      }
    ];
    
    return { success: true, data: integrations };
  } catch (error) {
    console.error('Error getting integrations:', error);
    return { success: false, error: 'Failed to get integrations' };
  }
}

export async function toggleIntegration(id: string, connect: boolean): Promise<ApiResponse<Integration>> {
  try {
    // In a real app, this would connect or disconnect an integration
    
    // Mock implementation
    const integration: Integration = {
      id,
      userId: '1',
      service: 'quickbooks', // This would be looked up from the database
      isConnected: connect,
      lastSynced: connect ? new Date() : undefined,
      metadata: connect ? { company_id: 'qb123456' } : undefined,
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date()
    };
    
    // Revalidate the settings page
    revalidatePath('/settings');
    
    return { 
      success: true, 
      data: integration, 
      message: connect ? 'Integration connected successfully' : 'Integration disconnected successfully' 
    };
  } catch (error) {
    console.error('Error toggling integration:', error);
    return { success: false, error: `Failed to ${connect ? 'connect' : 'disconnect'} integration` };
  }
}

export async function syncIntegration(id: string): Promise<ApiResponse<{ lastSynced: Date }>> {
  try {
    // In a real app, this would sync data from the integration
    
    // Mock implementation
    const lastSynced = new Date();
    
    // Revalidate appropriate pages that would show the synced data
    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/revenue');
    
    return { success: true, data: { lastSynced }, message: 'Integration synced successfully' };
  } catch (error) {
    console.error('Error syncing integration:', error);
    return { success: false, error: 'Failed to sync integration' };
  }
}

export async function exportData(format: 'csv' | 'excel' | 'pdf', dataType: 'expenses' | 'revenue' | 'all', dateRange?: DateRange): Promise<ApiResponse<{ url: string }>> {
  try {
    // In a real app, this would generate an export file and return a URL
    
    // Mock implementation
    const url = `/api/exports/${dataType}_${format}_${new Date().getTime()}.${format}`;
    
    return { success: true, data: { url }, message: 'Data exported successfully' };
  } catch (error) {
    console.error('Error exporting data:', error);
    return { success: false, error: 'Failed to export data' };
  }
}

// ==============================================
// Dashboard Functions
// ==============================================

export async function getDashboardSummary(): Promise<ApiResponse<{
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeVsExpenses: { month: string; income: number; expenses: number }[];
  recentTransactions: (Expense | Revenue)[];
}>> {
  try {
    // In a real app, this would calculate the dashboard summary from the database
    
    // Mock implementation
    const summary = {
      totalIncome: 12345,
      totalExpenses: 9876,
      netProfit: 2469,
      incomeVsExpenses: [
        { month: 'Oct', income: 10200, expenses: 8300 },
        { month: 'Nov', income: 11500, expenses: 9100 },
        { month: 'Dec', income: 13800, expenses: 10500 },
        { month: 'Jan', income: 11200, expenses: 9400 },
        { month: 'Feb', income: 12100, expenses: 9700 },
        { month: 'Mar', income: 12345, expenses: 9876 }
      ],
      recentTransactions: [
        {
          id: '1',
          userId: '1',
          date: new Date('2025-03-28'),
          description: 'Client Payment - XYZ Corp',
          amount: 3500,
          category: 'Income',
          client: 'XYZ Corp',
          paymentMethod: 'Bank Transfer',
          status: 'completed',
          createdAt: new Date('2025-03-28'),
          updatedAt: new Date('2025-03-28')
        },
        {
          id: '2',
          userId: '1',
          date: new Date('2025-03-27'),
          description: 'Office Supplies',
          amount: 250,
          category: 'Office Supplies',
          paymentMethod: 'Credit Card',
          status: 'completed',
          createdAt: new Date('2025-03-27'),
          updatedAt: new Date('2025-03-27')
        },
        {
          id: '3',
          userId: '1',
          date: new Date('2025-03-25'),
          description: 'Software Subscription',
          amount: 89,
          category: 'Software',
          paymentMethod: 'Credit Card',
          status: 'completed',
          createdAt: new Date('2025-03-25'),
          updatedAt: new Date('2025-03-25')
        },
        {
          id: '4',
          userId: '1',
          date: new Date('2025-03-22'),
          description: 'Client Payment - ABC Inc',
          amount: 2800,
          category: 'Income',
          client: 'ABC Inc',
          paymentMethod: 'Bank Transfer',
          status: 'completed',
          createdAt: new Date('2025-03-22'),
          updatedAt: new Date('2025-03-22')
        },
        {
          id: '5',
          userId: '1',
          date: new Date('2025-03-20'),
          description: 'Utilities',
          amount: 175,
          category: 'Utilities',
          paymentMethod: 'Bank Transfer',
          status: 'completed',
          createdAt: new Date('2025-03-20'),
          updatedAt: new Date('2025-03-20')
        }
      ]
    };
    
    return { success: true, data: summary };
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    return { success: false, error: 'Failed to get dashboard summary' };
  }
}

export async function getMonthlyComparison(year: number, month: number): Promise<ApiResponse<{
  currentMonth: { income: number; expenses: number; profit: number };
  previousMonth: { income: number; expenses: number; profit: number };
  percentageChanges: { income: number; expenses: number; profit: number };
}>> {
  try {
    // In a real app, this would calculate the monthly comparison from the database
    
    // Mock implementation
    const comparison = {
      currentMonth: { income: 12345, expenses: 9876, profit: 2469 },
      previousMonth: { income: 12100, expenses: 9700, profit: 2400 },
      percentageChanges: { income: 2.02, expenses: 1.81, profit: 2.88 }
    };
    
    return { success: true, data: comparison };
  } catch (error) {
    console.error('Error getting monthly comparison:', error);
    return { success: false, error: 'Failed to get monthly comparison' };
  }
}