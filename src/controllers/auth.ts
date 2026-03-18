import { supabase } from '../models/SupabaseClient';

const loginForm = document.getElementById('login-form') as HTMLFormElement;

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        // تلاش برای ورود
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            console.log("Login successful:", data);
            // انتقال به صفحه اصلی بعد از ورود موفق
            window.location.href = 'index.html';
        }
    });
}

// چک کردن وضعیت لاگین (اگر کاربر قبلاً لاگین کرده، بفرستش به پنل)
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

checkUser();