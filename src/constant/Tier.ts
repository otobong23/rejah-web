import reverb from '@/assets/Tier/reverb.png'
import reverb2 from '@/assets/Tier/reverb2.png'
import votan from '@/assets/Tier/votan.png'
import votan2 from '@/assets/Tier/votan2.png'


export const BUTTON_LIST = [
   { title: 'Rebound', icon: 'icon-park-twotone:five-star-badge', iconColor: '#10B981' },
   { title: 'Premium', icon: 'icon-park-solid:five-star-badge', iconColor: '#F59E0B' },
]

export const REBOUND_TIER_LIST: TIER_LIST_TYPE[] = [
   {
      type: 'rebound_tier',
      title: 'Reverb',
      image: reverb,
      details: {
         price: '$11',
         daily_yield: '$0.50',
         duration: '30 Days',
         roi: '$15',
         purchase_limit: '1'
      }
   },
   {
      type: 'rebound_tier',
      title: 'Votan',
      image: votan,
      details: {
         price: '$50',
         daily_yield: '$2',
         duration: '50 Days',
         roi: '$100',
         purchase_limit: '1'
      }
   }
]

export const PREMIUM_TIER_LIST: TIER_LIST_TYPE[] = [
   {
      type: 'premium_tier',
      title: 'Reverb 2.0',
      image: reverb2,
      details: {
         price: '$30',
         daily_yield: '$1.20',
         duration: '60 Days',
         roi: '$72',
         purchase_limit: '1'
      }
   },
   {
      type: 'premium_tier',
      title: 'Votan 2.0',
      image: votan2,
      details: {
         price: '$120',
         daily_yield: '$4',
         duration: '50 Days',
         roi: '$200',
         purchase_limit: '1'
      }
   }
]

export const TRANSACTION_RULES = [
   'Please do not add assets to accounts other than the official account, otherwise the assets will not be retrieved.',
   'The Deposit amount must be exactly the same as the actual order amount',
   'The Deposit arrival time is based on the bank arrival time. It usually arrives within 5-10 minutes. If it does not arrive after more than 48 hours, please contact the manager for verification.'
]

export const TRANSACTION_RULES_WITHDRAWAL = [
   "Withdrawal time: Withdrawals can be made at any time from Monday to Friday, 9:00 AM to 5:00 PM.",
   "Minimum withdrawal: $5",
   "Percentage Withdrawal Charge: 10%",
   "Arrival time: Determined based on the arrival time of international bank transfers, usually 24-48 hours.",
   "please ensure that your bank account is correct, if not your funds may be lost!!"
];