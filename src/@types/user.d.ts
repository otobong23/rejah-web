
type withdrawalWallet = {
  walletAddress: string;
  amount: number;
};

type UserType = {
  userID: string
  username: string;
  email: string;
  balance: number;
  totalYield: number;
  totalWithdraw: number;
  totalDeposit: number;
  transactionCount: number;
  currentPlan: string[];
  previousPlan: string[];
  whatsappNo?: string;
  facebook?: string;
  telegram?: string;
  profileImage?: string;
  referral_code: string;
  referredBy?: string;
  referral_count?: number;
  depositAddress: string;
  usdtWallet: string;
  walletPassword: string
  withdrawalWallet?: withdrawalWallet;
  withdrawStatus?: 'pending' | 'completed' | 'failed';
  ActivateBot?: boolean;
  vip: number;
  joinDate?: Date;
};

type UserContextType = {
   user: UserType;
   setUser: React.Dispatch<React.SetStateAction<UserContextType['user']>>
}