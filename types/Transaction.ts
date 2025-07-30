export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface FilterOptions {
  type: 'all' | 'income' | 'expense';
  dateFrom?: string;
  dateTo?: string;
}