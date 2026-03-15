import Chart from 'chart.js/auto';
import type { Transaction } from '../models/types';

let myChart: any = null;

export const ChartManager = {
    updateChart(transactions: Transaction[]) {
        const ctx = document.getElementById('financeChart') as HTMLCanvasElement;
        if (!ctx) return;

        // محاسبه مقادیر
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // اگر نمودار از قبل وجود داشت، نابودش کن تا دوباره ساخته شه
        if (myChart) {
            myChart.destroy();
        }

        // تنظیمات به سبک Apple Card
        const config: any = {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expense'],
                datasets: [{
                    data: [income, expense],
                    backgroundColor: ['#34c759', '#ff3b30'], // سبز و قرمز اپل
                    borderWidth: 0,
                    hoverOffset: 10,
                    cutout: '80%' // حلقه ظریف
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false // مخفی کردن راهنما برای تمیزی بیشتر
                    }
                }
            }
        };

        myChart = new Chart(ctx, config);
    }
};