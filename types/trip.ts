export interface Member {
  name: string;
  role: 'organizer' | 'contributor';
}

export interface Expense {
  id: number;
  name: string;
  amount: number;
  currency: string;
  paidBy: string;
  splitAmong: string[];
  date: string;
  category: string;
}

export interface RecurringExpense {
  id: number;
  name: string;
  amount: number;
  currency: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  paidBy: string;
  splitAmong: string[];
  category: string;
}

export interface Trip {
  id: number;
  name: string;
  budget: number | null;
  budgetCurrency: string;
  members: Member[];
  expenses: Expense[];
  recurringExpenses: RecurringExpense[];
  category: string;
  expenseCategories: string[];
  group: number | null;
}

export interface Group {
  id: number;
  name: string;
  trips: number[];
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}

