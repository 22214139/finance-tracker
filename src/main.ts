import type { Transaction } from './types.js';
import  { supabase } from './SupabaseClient.js'; // حتماً این فایل رو قبلاً ساخته باشی

const balanceEl = document.querySelector('#balance-amount') as HTMLSpanElement;
const form = document.querySelector('#transaction-form') as HTMLFormElement;
const list = document.querySelector('#transaction-list') as HTMLUListElement;

let transactions: Transaction[] = [];


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
        li.className = 'transaction-item';
        const sign = transaction.type === 'income' ? '+' : '-';
        const colorClass = transaction.type === 'income' ? 'text-success' : 'text-danger';

        li.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${transaction.icon}</span>
                <span>${transaction.title}</span>
            </div>
            <span class="${colorClass}">${sign}$${transaction.amount.toLocaleString()}</span>
            <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">❌</button>
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
}


form.addEventListener('submit', async (e) => { 
    e.preventDefault();

    const titleInput = document.querySelector('#title') as HTMLInputElement;
    const amountInput = document.querySelector('#amount') as HTMLInputElement;
    const typeSelect = document.querySelector('#type') as HTMLSelectElement;

   const newTransaction: Transaction = {
    id: Math.random().toString(36).substring(2, 9),
    title: titleInput.value,
    amount: Number(amountInput.value), // اینجا رو حتماً Number بذار
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