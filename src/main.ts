import type { Transaction } from './types.js';
import  { supabase } from './SupabaseClient.js'; 
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const balanceEl = document.querySelector('#balance-amount') as HTMLSpanElement;
const form = document.querySelector('#transaction-form') as HTMLFormElement;
const list = document.querySelector('#transaction-list') as HTMLUListElement;

let transactions: Transaction[] = [];
let myChart: Chart | null = null; 
function updateChart() {
    const ctx = document.getElementById('financeChart') as HTMLCanvasElement;
    if (!ctx) return;

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    if (myChart) {
        myChart.destroy();
    }

  
    const config: any = {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#34c759', '#ff3b30'], 
                borderWidth: 0,
                hoverOffset: 10,
                cutout: '80%' 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    myChart = new Chart(ctx, config);
}
async function fetchTransactions() {
    const { data, error } = await supabase
        .from('transactions')
        .select('*');

    if (error) {
        console.error('Error fetching:', error);
    } else {
        transactions = data || [];
        updateUI();
    }
}


async function addToDatabase(newTransaction: Transaction) {
    const { error } = await supabase
        .from('transactions')
        .insert([newTransaction]);

    if (error) {
        alert("خطا در ذخیره سازی در دیتابیس!");
        console.error(error);
    } else {
        console.log("در دیتابیس ذخیره شد! 🎉");
    }
}


async function deleteFromDatabase(id: string) {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) console.error(error);
}


function getIcon(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('food') || t.includes('pizza')) return '🍔';
    if (t.includes('salary') || t.includes('income')) return '💰';
    if (t.includes('car') || t.includes('taxi')) return '🚗';
    return '💸';
}

function renderList() {
    if (!list) return;
    list.innerHTML = "";
    transactions.forEach((transaction) => {
        const li = document.createElement('li');
  
       li.className = 'flex justify-between items-center p-4 bg-transparent border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer';
        
        const isIncome = transaction.type === 'income';
        const colorClass = isIncome ? 'text-emerald-600' : 'text-rose-600';
        const sign = isIncome ? '+' : '-';

        li.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-xl">
                    ${transaction.icon}
                </div>
                <div>
                    <p class="font-bold text-slate-800">${transaction.title}</p>
                    <p class="text-xs text-slate-400 capitalize">${transaction.type}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="font-bold ${colorClass}">${sign}$${transaction.amount.toLocaleString()}</span>
                <button onclick="deleteTransaction('${transaction.id}')" 
                    class="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-300 hover:text-rose-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}
function updateUI() {
    const total = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
    if (balanceEl) {
        balanceEl.innerText = `$${total.toLocaleString()}`;
        balanceEl.style.color = total >= 0 ? '#2ecc71' : '#e74c3c';
    }
    renderList();
    updateChart();
}

updateChart();

form.addEventListener('submit', async (e) => { 
    e.preventDefault();

    const titleInput = document.querySelector('#title') as HTMLInputElement;
    const amountInput = document.querySelector('#amount') as HTMLInputElement;
    const typeSelect = document.querySelector('#type') as HTMLSelectElement;

   const newTransaction: Transaction = {
    id: Math.random().toString(36).substring(2, 9),
    title: titleInput.value,
    amount: Number(amountInput.value), 
    type: typeSelect.value as 'income' | 'expense',
    category: 'General',
    icon: getIcon(titleInput.value),
    date: new Date().toISOString()
};

    
    const { error } = await supabase
        .from('transactions')
        .insert([newTransaction]);

    if (error) {
        alert('خطا در ذخیره در دیتابیس!');
        console.error('Error saving to database:', error);
    } else {
        console.log('با موفقیت در ابر ذخیره شد! ☁️');
        transactions.push(newTransaction);
        updateUI();
        form.reset();
    }
  
});
(window as any).deleteTransaction = async (id: string) => {
    await deleteFromDatabase(id);
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
};


fetchTransactions()