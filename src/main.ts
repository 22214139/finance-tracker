import type { Transaction } from './types';


const balanceEl = document.querySelector('#balance-amount') as HTMLSpanElement;
const form = document.querySelector('#transaction-form') as HTMLFormElement;
const list = document.querySelector('#transaction-list') as HTMLUListElement;


let transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');



function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
function getIcon(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('food') || t.includes('pizza') || t.includes('burger')) return '🍔';
    if (t.includes('salary') || t.includes('income') || t.includes('pay')) return '💰';
    if (t.includes('car') || t.includes('taxi') || t.includes('uber')) return '🚗';
    if (t.includes('rent') || t.includes('house')) return '🏠';
    if (t.includes('game') || t.includes('play')) return '🎮';
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
        <span style="font-size: 1.5rem;">${transaction.icon}</span>
        <span>${transaction.title}</span>
    </div>
    <span class="${colorClass}">${sign}$${transaction.amount.toLocaleString()}</span>
    <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">❌</button>
`;
        list.appendChild(li);
    });
}

function updateUI() {
    const total = transactions.reduce((acc, transaction) => {
        return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);

    if (balanceEl) {
        balanceEl.innerText = `$${total.toLocaleString()}`;
        balanceEl.style.color = total >= 0 ? '#2ecc71' : '#e74c3c';
    }

    renderList();
    saveToLocalStorage();
}



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = document.querySelector('#title') as HTMLInputElement;
    const amountInput = document.querySelector('#amount') as HTMLInputElement;
    const typeSelect = document.querySelector('#type') as HTMLSelectElement;

    const newTransaction: Transaction = {
    id: Math.random().toString(36).substring(2, 9),
    title: titleInput.value,
    amount: parseFloat(amountInput.value),
    type: typeSelect.value as 'income' | 'expense',
    category: 'General',
    icon: getIcon(titleInput.value), 
    date: new Date().toLocaleDateString()
};

    transactions.push(newTransaction);
    updateUI();
    form.reset();
});


(window as any).deleteTransaction = (id: string) => {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
};

updateUI();