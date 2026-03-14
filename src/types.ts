export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    created_at?: string;
}

export type AppState = {
    transactions: Transaction[];
    totalBalance: number;
}