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
  createdAt?: string;
  updatedAt?: string;
}

interface transactionResponseType {
  transactions: UserTransaction[],
  total: number,
  totalPages: number,
  page: number
}