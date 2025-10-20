
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
  currentPlan: TIER_LIST_TYPE[];
  previousPlan: TIER_LIST_TYPE[];
  whatsappNo?: string;
  facebook?: string;
  telegram?: string;
  profileImage?: string;
  referral_code: string;
  referredBy?: string;
  referral_count?: number;
  depositAddress: string;
  usdtWallet: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  walletPassword: string
  withdrawalWallet?: withdrawalWallet;
  withdrawStatus?: 'pending' | 'completed' | 'failed';
  twentyFourHourTimerStart?: string | undefined;
  spinWheelTimerStart: number
  ActivateBot?: boolean;
  vip: number;
  meter: number;
  joinDate?: Date;
};

type UserContextType = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserContextType['user']>>
}

type UserResponse = {
  users: UserType[],
  limit: number
  page: number
  total: number
  totalPages: number
}