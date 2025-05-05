'use server';

import { createClient } from "@/api/supabaseServer";
import { revalidatePath } from "next/cache";
import { 
  DateRange,
  ExpenseFilterOptions as FilterOptions,
  Expense, 
  ExpenseStats 
} from "@/api/types";

// Get all expenses with filters
export async function getExpenses(filters: FilterOptions = {}) {
  try {
    const supabase = await createClient();
    
    // Create the base query
    let query = supabase
      .from('expenses')
      .select('*');
    
    // Apply filters
    if (filters.searchQuery) {
      query = query.ilike('description', `%${filters.searchQuery}%`);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      // Using 'in' with string array for category
      query = query.in('category', filters.categories);
    }
    
    if (filters.statuses && filters.statuses.length > 0) {
      query = query.in('status', filters.statuses);
    }
    
    if (filters.dateRange?.startDate) {
      query = query.gte('date', filters.dateRange.startDate);
    }
    
    if (filters.dateRange?.endDate) {
      query = query.lte('date', filters.dateRange.endDate);
    }
    
    // Apply sorting
    if (filters.sortField) {
      query = query.order(filters.sortField, { 
        ascending: filters.sortDirection === 'asc' 
      });
    } else {
      query = query.order('date', { ascending: false });
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    query = query.range(from, to);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching expenses:', error);
      return { 
        success: false, 
        message: error.message,
        status: error.code 
      };
    }
    
    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true });
    
    return { 
      success: true,
      data: data || [],
      totalCount: totalCount || 0,
      page,
      pageSize,
      totalPages: Math.ceil((totalCount || 0) / pageSize)
    };
  } catch (error: any) {
    console.error('Unexpected error fetching expenses:', error);
    return { 
      success: false, 
      message: error?.message || 'An unexpected error occurred',
      status: 500
    };
  }
}

// Get expense statistics
export async function getExpenseStats(dateRange?: DateRange) {
  try {
    const supabase = await createClient();
    
    // Base query for total amount
    let query = supabase
      .from('expenses')
      .select('amount, status');
    
    // Apply date filters if provided
    if (dateRange?.startDate) {
      query = query.gte('date', dateRange.startDate);
    }
    
    if (dateRange?.endDate) {
      query = query.lte('date', dateRange.endDate);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching expense stats:', error);
      return { 
        success: false, 
        message: error.message,
        status: error.code 
      };
    }
    
    // Calculate stats
    const totalAmount = data.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
    const pendingExpenses = data.filter(expense => expense.status === 'pending');
    const pendingAmount = pendingExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
    const averageAmount = data.length > 0 ? totalAmount / data.length : 0;
    
    return { 
      success: true,
      totalAmount,
      pendingAmount,
      averageAmount,
      pendingCount: pendingExpenses.length,
      totalCount: data.length
    };
  } catch (error: any) {
    console.error('Unexpected error fetching expense stats:', error);
    return { 
      success: false, 
      message: error?.message || 'An unexpected error occurred',
      status: 500
    };
  }
}

// Create a new expense with string category
export async function createExpense(expense: Expense) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        date: expense.date,
        description: expense.description,
        amount: expense.amount,
        category: expense.category, // Direct string value
        status: expense.status,
        receipt_url: expense.receipt_url,
        notes: expense.notes,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating expense:', error);
      return { 
        success: false, 
        message: error.message,
        status: error.code 
      };
    }
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { 
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Unexpected error creating expense:', error);
    return { 
      success: false, 
      message: error?.message || 'An unexpected error occurred',
      status: 500
    };
  }
}

// Update an existing expense with string category
export async function updateExpense(expenseId: number, expense: Expense) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('expenses')
      .update({
        date: expense.date,
        description: expense.description,
        amount: expense.amount,
        category: expense.category, // Direct string value
        status: expense.status,
        receipt_url: expense.receipt_url,
        notes: expense.notes,
        updated_at: new Date()
      })
      .eq('id', expenseId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating expense:', error);
      return { 
        success: false, 
        message: error.message,
        status: error.code 
      };
    }
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { 
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Unexpected error updating expense:', error);
    return { 
      success: false, 
      message: error?.message || 'An unexpected error occurred',
      status: 500
    };
  }
}

// Delete an expense
export async function deleteExpense(expenseId: number) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);
    
    if (error) {
      console.error('Error deleting expense:', error);
      return { 
        success: false, 
        message: error.message,
        status: error.code 
      };
    }
    
    // Revalidate the expenses page
    revalidatePath('/expenses');
    
    return { 
      success: true
    };
  } catch (error: any) {
    console.error('Unexpected error deleting expense:', error);
    return { 
      success: false, 
      message: error?.message || 'An unexpected error occurred',
      status: 500
    };
  }
}