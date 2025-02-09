export interface Subscription {
  _id: string;
  name: string;
  currency: 'USD' | 'INR' | 'GBP';
  price: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: 'Entertainment' | 'Education' | 'Health' | 'Fitness' | 'Productivity' | 'Utilities' | 'Other';
  paymentMethod: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  renewalDate: string;
  user: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}