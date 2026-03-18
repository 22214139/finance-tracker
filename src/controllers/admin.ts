import { supabase } from '../models/SupabaseClient';
import { AdminView } from '../views/AdminView';
import { ChartManager } from '../views/ChartManager';
import type { Transaction } from '../models/types';
  
async function protectRoute() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // اگر کاربر لاگین نبود، شوتش کن به صفحه لاگین!
        window.location.href = 'login.html';
    }
}

protectRoute();
// ۱. تابع حذف تراکنش
async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this?")) return;

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) {
        alert("Delete failed: " + error.message);
    } else {
        initAdmin(); // لیست و نمودار رو دوباره آپدیت کن
    }
}

// ۲. تابع اصلی برای لود کردن پنل
async function initAdmin() {
    console.log("Admin Controller: Fetching data...");

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error:", error.message);
        return;
    }

    if (data) {
        const transactions = data as Transaction[];
        
        // --- صدا کردن ویوها ---
        AdminView.renderStats(transactions);
        AdminView.renderTable(transactions);
        
        // --- آپدیت کردن نمودار (اینجا باید باشه) ---
        ChartManager.updateChart(transactions);

        // فعال کردن دکمه‌های حذف
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.target as HTMLElement).getAttribute('data-id');
                if (id) handleDelete(id);
            });
        });
    }
}

// ۳. شروع به کار
initAdmin();