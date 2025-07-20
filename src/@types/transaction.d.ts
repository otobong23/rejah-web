type TransactionType = 'deposit' | 'withdrawal' | 'tier' | 'bonus' | 'yield';
type TransactionStatus = 'pending' | 'completed' | 'failed';

interface UserTransaction {
  _id: string;
  transactionID?: string;
  email: string;
  type: TransactionType;
  amount: number;
  image?: string;
  status: TransactionStatus;
  plan?: string
  Coin?: string; // Optional because not marked as required in schema
  date?: string | Date; // Could be a string from API or Date if parsed
  withdrawWalletAddress?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface transactionResponseType {
  transactions: UserTransaction[],
  total: number,
  totalPages: number,
  page: number
}

type Bank = {
  name: string;
  slug: string;
  code: string;
  ussd: string;
  logo: string;
};

// Define Form type
type FormType = {
  bank_name: string;
  account_name: string;
  account_number: string;
  Withdrawal_Password: string;
  Confirm_Withdrawal_Password: string;
};

// Error type
type ErrorType = { [key: string]: string };