import { SupabaseService } from '../models/SupabaseService.js';
import { ChartManager } from '../views/ChartManager.js';
import { UIController } from '../views/AppViews.js';
import type { Transaction } from '../models/types.js';

let transactions: Transaction[] = [];

async function initApp() {
    try {
        transactions = await SupabaseService.fetchTransactions();
        updateAllLayers();
    } catch (error) {
        console.error("Error loading app:", error);
    }
}

function updateAllLayers() {
    UIController.renderList(transactions, handleDelete);
    UIController.updateBalance(transactions);
    ChartManager.updateChart(transactions);
}

async function handleDelete(id: string) {
    await SupabaseService.deleteTransaction(id);
    transactions = transactions.filter(t => t.id !== id);
    updateAllLayers();
}

const form = document.getElementById('transaction-form') as HTMLFormElement;
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const amountEl = document.getElementById('amount') as HTMLInputElement;
    const typeEl = document.getElementById('type') as HTMLSelectElement;

    const newDoc = await SupabaseService.addTransaction({ 
        title: titleEl.value, 
        amount: parseFloat(amountEl.value), 
        type: typeEl.value as 'income' | 'expense' 
    });

    transactions.unshift(newDoc);
    updateAllLayers();
    form.reset();
});

initApp();