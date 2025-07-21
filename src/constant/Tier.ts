import poly from '@/assets/Tier/PolyCycle.png'
import flexForm from '@/assets/Tier/FlexForm.png'
import rubberRise from '@/assets/Tier/RubberRise.png'
import vaultan from '@/assets/Tier/Vaultan.png'
import titane from '@/assets/Tier/Titane.png'
import nova from '@/assets/Tier/Nova.png'


export const BUTTON_LIST = [
   { title: 'Rebound', icon: 'icon-park-twotone:five-star-badge', iconColor: '#10B981' },
   { title: 'Premium', icon: 'icon-park-solid:five-star-badge', iconColor: '#F59E0B' },
]

export const REBOUND_TIER_LIST: TIER_LIST_TYPE[] = [
   {
      type: 'rebound_tier',
      title: 'PolyCycle',
      image: poly,
      details: {
         price: '$10',
         daily_yield: '$0.50',
         duration: '30 Days',
         roi: '$15',
         purchase_limit: '1'
      }
   },
   {
      type: 'rebound_tier',
      title: 'FlexForm',
      image: flexForm,
      details: {
         price: '$30',
         daily_yield: '$1.20',
         duration: '60 Days',
         roi: '$72',
         purchase_limit: '1'
      }
   },
   {
      type: 'rebound_tier',
      title: 'GridForm',
      image: flexForm,
      details: {
         price: '$50',
         daily_yield: '$2',
         duration: '60 Days',
         roi: '$120',
         purchase_limit: '1'
      }
   },
   {
      type: 'rebound_tier',
      title: 'CoreMelt',
      image: rubberRise,
      details: {
         price: '$80',
         daily_yield: '$2.50',
         duration: '90 Days',
         roi: '$225',
         purchase_limit: '1'
      }
   }, {
      type: 'rebound_tier',
      title: 'RubberRise',
      image: rubberRise,
      details: {
         price: '$120',
         daily_yield: '$4.00',
         duration: '80 Days',
         roi: '$320',
         purchase_limit: '1'
      }
   },
]

export const PREMIUM_TIER_LIST: TIER_LIST_TYPE[] = [
   {
      type: 'premium_tier',
      title: 'Vaultan',
      image: vaultan,
      details: {
         price: '$300',
         daily_yield: '$6',
         duration: '120 Days',
         roi: '$720',
         purchase_limit: '1'
      }
   },
   {
      type: 'premium_tier',
      title: 'Titane',
      image: titane,
      details: {
         price: '$500',
         daily_yield: '$8',
         duration: '180 Days',
         roi: '$1,440',
         purchase_limit: '1'
      }
   },
   {
      type: 'premium_tier',
      title: 'Nova',
      image: nova,
      details: {
         price: '$1,000',
         daily_yield: '$12',
         duration: '180 Days',
         roi: '$2,160',
         purchase_limit: '1'
      }
   }
]

export const TRANSACTION_RULES = [
   "please ensure that your bank account is correct!!",
   'Please do not add assets to accounts other than the official account, otherwise the assets will not be retrieved.',
   'The Deposit amount must be exactly the same as the actual order amount',
   'The Deposit arrival time is based on the bank arrival time. It usually arrives within 5-10 minutes. If it does not arrive after more than 48 hours, please contact the manager for verification.'
]

export const TRANSACTION_RULES_WITHDRAWAL = [
   "Withdrawal time: Withdrawals can be made at any time from Monday to Friday.",
   "Minimum withdrawal: $5",
   "Percentage Withdrawal Charge: 10%",
   "Arrival time: Determined based on the arrival time of international bank transfers, usually 24-48 hours.",
   "Withdrawal account: Ensure that your USDT account or wallet address is correct, if not your withdrawal funds may be lost."
];