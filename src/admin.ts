<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Finance Tracker</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 font-sans">
    <div class="flex">
        <div class="w-64 h-screen bg-black text-white p-6 sticky top-0">
            <h2 class="text-2xl font-bold mb-10">Admin Dashboard</h2>
            <nav class="space-y-4">
                <a href="#" class="block p-3 bg-white/10 rounded-xl">Transactions</a>
                <a href="index.html" class="block p-3 text-slate-400 hover:text-white transition">Back to App</a>
            </nav>
        </div>

        <main class="flex-1 p-10">
            <header class="mb-10">
                <h1 class="text-3xl font-bold text-slate-800">Global Transactions</h1>
                <p class="text-slate-500">Monitor all system activities</p>
            </header>

            <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th class="p-4 font-semibold text-slate-600">ID</th>
                            <th class="p-4 font-semibold text-slate-600">Title</th>
                            <th class="p-4 font-semibold text-slate-600">Amount</th>
                            <th class="p-4 font-semibold text-slate-600">Type</th>
                            <th class="p-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="admin-table-body">
                        </tbody>
                </table>
            </div>
        </main>
    </div>

    <script type="module" src="/src/admin.ts"></script>
</body>
</html>