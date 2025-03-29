export interface User {
  id: string;
  email: string;
  token: string;
}

export interface StockHistory {
  id: string;
  stockId: string;
  price: number;
  timestamp: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
  history: StockHistory[];
  changePercentage: string;
}

export interface Trade {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
  timestamp: string;
}