import { TransactionDATA } from "../helpers/types";

export const TransactionData: TransactionDATA[] = [
    {
        id: 1,
        name: 'Wallet Top-up',
        amount: '1,000',
        date: '10th, Aug 2023',
        success: false,
        type: 'deposit',
    },
    {
        id: 2,
        name: 'Wallet Top-up',
        amount: '1,000',
        date: '9th, Aug 2023',
        success: true,
        type: 'deposit',
    },
    {
        id: 3,
        name: 'Savings',
        amount: '10,000',
        date: '6th, Aug 2023',
        success: false,
        type: 'savings',
    },
    {
        id: 4,
        name: 'Loans',
        amount: '32,100',
        date: '6th, Aug 2023',
        success: true,
        type: 'loan',
    },
    {
      id: 5,
      name: 'Savings',
      amount: '28,000',
      date: '6th, Aug 2023',
      success: true,
      type: 'savings',
    },
    {
      id: 6,
      name: 'Loans',
      amount: '18,000',
      date: '26th, Jul 2023',
      success: true,
      type: 'loan repayment',
    },
    {
        id: 7,
        name: 'Wallet Top-up',
        amount: '1,000',
        date: '26th, Jul 2023',
        success: true,
        type: 'deposit',
    },
    {
        id: 8,
        name: 'Savings',
        amount: '10,000',
        date: '26th, Jul 2023',
        success: false,
        type: 'savings',
    }
]