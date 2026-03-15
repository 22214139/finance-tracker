import { createClient } from '@supabase/supabase-js';

// استفاده از "as string" برای اینکه تایپ‌اسکریپت مطمئن شود این‌ها رشته هستند
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// یک چک ساده برای اینکه اگر فایل .env ست نشده بود، سریع بفهمی
if (!supabaseUrl || !supabaseKey) {
    console.error("خطا: متغیرهای محیطی Supabase در فایل .env پیدا نشدند!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);