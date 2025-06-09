'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Nunito_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


const nunitoSans = Nunito_Sans({
   variable: "--font-nunito_sans",
   subsets: ["latin"],
});

const FILTER = ['All', 'Income', 'Deposit', 'Commission', 'Bonus']
const HISTORY_TYPE = ['deposit', 'withdrawal', 'tier_upgrade', 'auto_payout', 'new_yield']

const HISTORY = [
   {
      type: 'deposit',
      amount: 50,
      status: 'success'
   }, {
      type: 'withdrawal',
      amount: 30,
      status: 'success'
   }, {
      type: 'deposit',
      amount: 50,
      status: 'success'
   }, {
      type: 'tier_upgrade',
      rank: 'RubberRise-TreadForge',
      status: 'success'
   }, {
      type: 'auto_payout',
      amount: 3,
      status: 'success'
   }, {
      type: 'new_yield',
      amount: 15,
      status: 'success'
   }, {
      type: 'deposit',
      amount: 50,
      status: 'success'
   }, {
      type: 'new_yield',
      amount: 15,
      status: 'success'
   }
]

const page = () => {
   const router = useRouter()
   const [stack, setStack] = useState(1);
   return (
      <div className={`${nunitoSans.className}`}>
         <button onClick={() => stack > 1 ? setStack(prev => prev - 1) : router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
            <Icon icon='fluent:ios-arrow-24-regular' className="" />
         </button>
         <h1 className="text-[40px] font-bold mb-8">Account History</h1>
         <div className="flex gap-2 my-3 overflow-scroll lg:overflow-auto no-scrollbar">
            {FILTER.map(a => (
               <button key={a} className='py-2 px-4 min-w-[90px] rounded-[15px] flex items-center justify-center bg-[#002732]'>{a}</button>
            ))}
         </div>
         <div className='flex flex-col gap-3 overflow-scroll no-scrollbar'>
            {HISTORY.map((item, index) => (
               <div key={item.type + index} className='flex py-2.5 px-5 bg-white/7 gap-3 rounded-[15px] items-center'>
                  <div>
                     <span><Icon icon={
                        item.type === 'deposit' ? 'ant-design:dollar-circle-filled'
                           : item.type === 'withdrawal' ? 'streamline:payment-10-solid'
                              : item.type === 'tier_upgrade' ? 'fa6-solid:money-bill-trend-up'
                                 : item.type === 'auto_payout' ? 'solar:hand-money-bold'
                                    : 'mingcute:notification-fill'
                     } className={`text-4xl ${item.type === 'deposit' ? 'text-[#3B82F6]'
                        : item.type === 'withdrawal' ? 'text-[#10B981]'
                           : item.type === 'tier_upgrade' ? 'text-[#8B5CF6]'
                              : item.type === 'auto_payout' ? 'text-[#F59E0B]'
                                 : 'text-[#F94E4E]'}`} />
                     </span>
                  </div>
                  <div className='text-(--color2)'>
                     <h1 className='text-sm font-semibold mb-1'>
                        {item.type === 'deposit' ? `Deposit Successful!`
                           : item.type === 'withdrawal' ? ` Withdrawal Processed`
                              : item.type === 'tier_upgrade' ? `Tier Upgrade Confirmed`
                                 : item.type === 'auto_payout' ? `Auto-Payout Received`
                                    : `New Yield Alert`}
                     </h1>
                     <p className='text-xs font-normal text-(--color2)/50'>
                        {item.type === 'deposit' ? `You just added $${item.amount} to your wallet. Your balance is now growing stronger!`
                           : item.type === 'withdrawal' ? `$${item.amount} has been successfully withdrawn to your linked account. Track it in your history.`
                              : item.type === 'tier_upgrade' ? `Congrats! You’ve moved from ${item.rank?.split('-')[0]} to ${item.rank?.split('-')[1]}. New returns unlocked.`
                                 : item.type === 'auto_payout' ? `You just earned $${item.amount} from your daily yield. Keep building your streak!`
                                    : `Your PolyCycle pack just matured. You earned $${item.amount} in total!`}
                     </p>
                  </div>
               </div>
            ))}
         </div>

      </div>
   )
}

export default page