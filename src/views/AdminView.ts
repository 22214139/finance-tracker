import type { Transaction } from '../models/types';

export const AdminView = {
    // نمایش آمار (تعداد و حجم مالی)
    renderStats(transactions: Transaction[]) {
        const totalCount = transactions.length;
        const totalVolume = transactions.reduce((acc, t) => {
            return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);

        const countEl = document.getElementById('total-count');
        const volumeEl = document.getElementById('total-volume');

        if (countEl) countEl.textContent = totalCount.toString();
        if (volumeEl) volumeEl.textContent = `$${totalVolume.toLocaleString()}`;
    },

    // نمایش جدول تراکنش‌ها
    renderTable(transactions: Transaction[]) {
        const tableBody = document.getElementById('admin-table-body');
        if (!tableBody) return;

        if (transactions.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-500 font-bold">No Transactions Found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = transactions.map(t => `
            <tr class="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                <td class="p-6 text-slate-300">${t.title}</td>
                <td class="p-6 font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}">
                    ${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </td>
                <td class="p-6">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}">
                        ${t.type}
                    </span>
                </td>
                // بجای کد قبلی، این مدل "امن" را تست کن:
<td class="p-6 text-sm text-slate-500 font-mono">
    ${t.created_at ? new Date(t.created_at).toLocaleDateString('en-GB') : '---'}
</td>
                <td class="p-6 text-center">
                    <button class="delete-btn text-rose-500 hover:text-rose-400 font-black text-xs" data-id="${t.id}">
                        DELETE
                    </button>
                </td>
            </tr>
        `).join('');
    }
};