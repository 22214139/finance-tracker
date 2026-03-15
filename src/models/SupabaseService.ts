import { supabase } from './SupabaseClient';
import type  { Transaction } from './types';

export const SupabaseService = {
    async fetchTransactions(): Promise<Transaction[]> {
        const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },
    async addTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('transactions').insert([transaction]).select();
        if (error) throw error;
        return data[0];
    },
    async deleteTransaction(id: string) {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;
    }
};
// بخشی از Model
export const deleteTransactionFromDB = async (id: string) => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
    return { error };
};