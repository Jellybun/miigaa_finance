'use server';

import { createClient } from "@/api/supabaseServer";
import { revalidatePath } from "next/cache";
import { 
  DateRange,
  RevenueFilterOptions as FilterOptions,
  Revenue, 
  RevenueStats 
} from "@/api/types";

// Get all revenues with filters
export async function getRevenues(filters: FilterOptions = {}) {
  try {
    const supabase = await createClient();
    
    // Create the base query
    let query = supabase
      .from('revenues')
      .select('*');
    
    // Apply filters
    if (filters.searchQuery) {
      query = query.or(`description.ilike.%${filters.searchQuery}%,client.ilike.%${filters.searchQuery}%,category.ilike.%${filters.searchQuery}%`);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }
    
    if (filters.clients && filters.clients.length > 0) {
      query = query.in('client', filters.clients);
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
      console.error('Error fetching revenues:', error);
      return { 
        success: false, 
        message: error.message,
        status: error.code 
      };
    }
    
    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('revenues')
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
    console.error('Unexpected error fetching revenues:', error);
    return { 
      success: false, 
      message: error?.message || 'An unexpected error occurred',
      status: 500
    };
  }
}

// Get revenue statistics
export async function getRevenueStats(dateRange?: DateRange) {
  try {
    const supabase = await createClient();
    
    // Base query for total amount
    let query = supabase
      .from('revenues')
      .select('amount, status, client, date');
    
    // Apply date filters if provided
    if (dateRange?.startDate) {
      query = query.gte('date', dateRange.startDate);
    }
    
    if (dateRange?.endDate) {
      query = query.lte('date', dateRange.endDate);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching revenue stats:', error);
      return { 
        success: false, 
        message: error.message,
        status: error.code 
      };
    }
    
    // Get previous month's data for comparison
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDayPrevMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
    
    const { data: prevMonthData, error: prevMonthError } = await supabase
      .from('revenues')
      .select('amount')
      .gte('date', firstDayPrevMonth)
      .lte('date', lastDayPrevMonth);
    
    if (prevMonthError) {
      console.error('Error fetching previous month data:', prevMonthError);
    }
    
    // Calculate current month data
    const firstDayCurrMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
    const lastDayCurrMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
    
    const currentMonthData = data.filter(rev => {
      const date = new Date(rev.date);
      return date >= new Date(firstDayCurrMonth) && date <= new Date(lastDayCurrMonth);
    });
    
    // Calculate stats
    const totalAmount = data.reduce((sum, revenue) => sum + parseFloat(revenue.amount.toString()), 0);
    const pendingRevenues = data.filter(revenue => revenue.status === 'pending');
    const pendingAmount = pendingRevenues.reduce((sum, revenue) => sum + parseFloat(revenue.amount.toString()), 0);
    const averageAmount = data.length > 0 ? totalAmount / data.length : 0;
    
    // Calculate current month total
    const currentMonthTotal = currentMonthData.reduce((sum, rev) => sum + parseFloat(rev.amount.toString()), 0);
    
    // Calculate previous month total
    const prevMonthTotal = prevMonthData
      ? prevMonthData.reduce((sum, rev) => sum + parseFloat(rev.amount.toString()), 0)
      : 0;
    
    // Calculate percent change
    const percentChange = prevMonthTotal > 0 
      ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100 
      : 0;
    
    // Find top client
    const revenueByClient = data.reduce((acc: Record<string, number>, rev) => {
      const client = rev.client;
      if (!acc[client]) acc[client] = 0;
      acc[client] += parseFloat(rev.amount.toString());
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
    
    return { 
      success: true,
      totalAmount,
      pendingAmount,
      averageAmount,
      pendingCount: pendingRevenues.length,
      totalCount: data.length,
      percentChange,
      topClient,
      topClientAmount
    };
  } catch (error: any) {
    console.error('Unexpected error fetching revenue stats:', error);
    return { 
      success: false, 
      message: error?.message || 'An unexpected error occurred',
      status: 500
    };
  }
}

// Create a new revenue
export async function createRevenue(revenue: any) {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('revenues')
        .insert({
          date: revenue.date,
          description: revenue.description,
          amount: revenue.amount,
          category: revenue.category,
          client: revenue.client,
          payment_method: revenue.payment_method,
          status: revenue.status,
          invoice: revenue.invoice,
          notes: revenue.notes,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating revenue:', error);
        return { 
          success: false, 
          message: error.message,
          status: error.code 
        };
      }
      
      // Revalidate the revenues page
      revalidatePath('/revenue');
      
      return { 
        success: true,
        data
      };
    } catch (error) {
      console.error('Unexpected error creating revenue:', error);
      return { 
        success: false, 
        status: 500
      };
    }
  }
  
  // Update an existing revenue
  export async function updateRevenue(revenueId: any, revenue: any) {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('revenues')
        .update({
          date: revenue.date,
          description: revenue.description,
          amount: revenue.amount,
          category: revenue.category,
          client: revenue.client,
          payment_method: revenue.payment_method,
          status: revenue.status,
          invoice: revenue.invoice,
          notes: revenue.notes,
          updated_at: new Date()
        })
        .eq('id', revenueId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating revenue:', error);
        return { 
          success: false, 
          message: error.message,
          status: error.code 
        };
      }
      
      // Revalidate the revenues page
      revalidatePath('/revenue');
      
      return { 
        success: true,
        data
      };
    } catch (error) {
      console.error('Unexpected error updating revenue:', error);
      return { 
        success: false, 
        status: 500
      };
    }
  }
  
  // Delete a revenue
  export async function deleteRevenue(revenueId: any) {
    try {
      const supabase = await createClient();
      
      const { error } = await supabase
        .from('revenues')
        .delete()
        .eq('id', revenueId);
      
      if (error) {
        console.error('Error deleting revenue:', error);
        return { 
          success: false, 
          message: error.message,
          status: error.code 
        };
      }
      
      // Revalidate the revenues page
      revalidatePath('/revenue');
      
      return { 
        success: true
      };
    } catch (error) {
      console.error('Unexpected error deleting revenue:', error);
      return { 
        success: false, 
        status: 500
      };
    }
  }