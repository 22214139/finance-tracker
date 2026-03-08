export interface Transaction {
    id: string;         
    title: string;     
    amount: number;      
    type: 'income' | 'expense'; 
    category: string;   
    date: string;      
}

export type AppState = {
    transactions: Transaction[];
    totalBalance: number;
}