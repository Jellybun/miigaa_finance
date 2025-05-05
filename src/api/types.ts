// api/types.ts

// Shared types
export interface DateRange {
    startDate?: string;
    endDate?: string;
  }
  
  // Base filter options for both expenses and revenues
  export interface BaseFilterOptions {
    searchQuery?: string;
    dateRange?: DateRange;
    statuses?: string[];
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }
  
  // Expense-specific filter options
  export interface ExpenseFilterOptions extends BaseFilterOptions {
    categories?: string[];
  }
  
  // Revenue-specific filter options
  export interface RevenueFilterOptions extends BaseFilterOptions {
    categories?: string[];
    clients?: string[];
  }
  
  // Expense type
  export interface Expense {
    id?: number;
    date: string;
    description: string;
    amount: number;
    category: string;
    status: 'pending' | 'completed' | 'cancelled';
    receipt_url?: string;
    notes?: string;
  }
  
  // Revenue type
  export interface Revenue {
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
  
  // Stats response types
  export interface BaseStats {
    totalAmount: number;
    pendingAmount: number;
    averageAmount: number;
    pendingCount: number;
    totalCount: number;
  }
  
  export interface ExpenseStats extends BaseStats {}
  
  export interface RevenueStats extends BaseStats {
    percentChange: number;
    topClient: string;
    topClientAmount: number;
  }