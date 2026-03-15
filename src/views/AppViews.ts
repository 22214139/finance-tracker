import type { Transaction } from '../models/types.js';

export const UIController = {
    renderList(transactions: Transaction[], onDelete: (id: string) => void) {
    const list = document.getElementById('transaction-list');
    if (!list) return;

    list.innerHTML = "";
    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-4 hover:bg-slate-50 transition-all rounded-2xl group cursor-default';

        const isIncome = transaction.type === 'income';
        const colorClass = isIncome ? 'text-emerald-500' : 'text-rose-500';
        const sign = isIncome ? '+' : '-';
        const amount = transaction.amount || 0;

        li.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-lg">
                    ${isIncome ? '💰' : '💸'}
                </div>
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-800">${transaction.title}</span>
                    <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium">${transaction.type}</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-sm font-bold ${colorClass}">${sign}${amount.toLocaleString()}</span>
                <button class="delete-btn opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn?.addEventListener('click', () => {
            if(confirm('آیا از حذف این تراکنش مطمئن هستید؟')) {
                onDelete(transaction.id);
            }
        });

        list.appendChild(li);
    });
},

    // آپدیت کردن عدد کل موجودی در بالای صفحه
    updateBalance(transactions: Transaction[]) {
        const balanceEl = document.getElementById('balance-amount');
        if (!balanceEl) return;

        const total = transactions.reduce((acc, t) => {
    const amt = t.amount || 0; // اگر نال بود، صفر در نظر بگیر
    return t.type === 'income' ? acc + amt : acc - amt;
}, 0);

        balanceEl.innerText = `$${total.toLocaleString()}`;
    }
};