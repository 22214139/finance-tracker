import type { Transaction } from './types';


const balanceEl = document.querySelector('#balance-amount') as HTMLSpanElement;
const form = document.querySelector('#transaction-form') as HTMLFormElement;
const list = document.querySelector('#transaction-list') as HTMLUListElement;

let transactions: Transaction[] = [];


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleInput = document.querySelector('#title') as HTMLInputElement;
    const amountInput = document.querySelector('#amount') as HTMLInputElement;
    const typeSelect = document.querySelector('#type') as HTMLSelectElement;

    const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        title: titleInput.value,
        amount: parseFloat(amountInput.value),
        type: typeSelect.value as 'income' | 'expense',
        category: 'General',
        date: new Date().toLocaleDateString()
    };

    transactions.push(newTransaction);
    

    console.log("Transactions:", transactions);
    
    updateUI(); 
    form.reset(); 
    function updateUI() {

    const total = transactions.reduce((acc, transaction) => {
        return transaction.type === 'income' 
            ? acc + transaction.amount 
            : acc - transaction.amount;
    }, 0);


    balanceEl.innerText = `$${total.toLocaleString()}`;
    
  
    balanceEl.style.color = total >= 0 ? '#2ecc71' : '#e74c3c';
    
    renderList();
    function renderList() {
    if (!list) return;


    list.innerHTML = "";

    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        
   
        const sign = transaction.type === 'income' ? '+' : '-';
        const colorClass = transaction.type === 'income' ? 'text-success' : 'text-danger';

        li.innerHTML = `
            <span>${transaction.title}</span>
            <span class="${colorClass}">${sign}$${transaction.amount.toLocaleString()}</span>
            <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">❌</button>
        `;
        
        list.appendChild(li);
    });
}
}
(window as any).deleteTransaction = (id: string) => {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
};
});