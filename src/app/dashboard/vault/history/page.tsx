'use client';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AxiosError } from 'axios';
import { Nunito_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";


const nunitoSans = Nunito_Sans({
   variable: "--font-nunito_sans",
   subsets: ["latin"],
});

const FILTER = [
   {
      title: 'All',
      type: 'all',
      stack: 1
   }, {
      title: 'Income',
      type: 'withdrawal',
      stack: 2
   }, {
      title: 'Deposit',
      type: 'deposit',
      stack: 3
   }, {
      title: 'Plans',
      type: 'tier',
      stack: 4
   }, {
      title: 'Commission',
      type: 'bonus',
      stack: 5
   }
]
const getFilterType = (stack: number) => {
   const found = FILTER.find(f => f.stack === stack);
   return found?.type ?? 'all';
};

const page = () => {
   const router = useRouter()
   const [stack, setStack] = useState(1);
   const [transaction, setTransaction] = useState<UserTransaction[]>()
   useEffect(() => {
      const getUser = async () => {
         const userToken = Cookies.get("userToken");

         if (!userToken) {
            router.replace("/auth/login");
            return;
         }

         try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get<{transactions: UserTransaction[]}>("/transaction/");
            setTransaction(response.data.transactions)
            console.log(response.data)
         } catch (err) {
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred during signup')
            }
         }
      }
      getUser()
   }, [])

   const filteredTransactions = React.useMemo(() => {
      if (!transaction?.length) return [];
      const type = getFilterType(stack);
      if (type === 'all') return transaction;
      return transaction.filter(item => item.type === type);
   }, [transaction, stack]);

   return (
      <div className={`${nunitoSans.className}`}>
         <button onClick={() => stack > 1 ? setStack(prev => prev - 1) : router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
            <Icon icon='fluent:ios-arrow-24-regular' className="" />
         </button>
         <h1 className="text-[40px] font-bold mb-8">Account History</h1>
         <div className="flex gap-2 my-3 overflow-scroll lg:overflow-auto no-scrollbar">
            {FILTER.map(({ title, type, stack }) => (
               <button key={title} onClick={() => setStack(stack)} className='py-2 px-6 rounded-[15px] flex items-center justify-center bg-[#002732]'>{title}</button>
            ))}
         </div>
         <div className='flex flex-col gap-3 overflow-scroll no-scrollbar max-w-[649px] mx-auto'>
            {filteredTransactions.length ? filteredTransactions.map((item, index) => (
               <div key={item.type + index} className='flex py-2.5 px-5 bg-white/7 gap-3 rounded-[15px] items-center'>
                  {/* ...existing transaction item code... */}
                  <div>
                     <span><Icon icon={
                        item.type === 'deposit' ? 'ant-design:dollar-circle-filled'
                           : item.type === 'withdrawal' ? 'streamline:payment-10-solid'
                              : item.type === 'tier' ? 'fa6-solid:money-bill-trend-up'
                                 : item.type === 'bonus' ? 'solar:hand-money-bold'
                                    : 'mingcute:notification-fill'
                     } className={`text-4xl ${item.type === 'deposit' ? 'text-[#3B82F6]'
                        : item.type === 'withdrawal' ? 'text-[#10B981]'
                           : item.type === 'tier' ? 'text-[#8B5CF6]'
                              : item.type === 'bonus' ? 'text-[#F59E0B]'
                                 : 'text-[#F94E4E]'}`} />
                     </span>
                  </div>
                  <div className='text-(--color2)'>
                     <h1 className='text-sm font-semibold mb-1'>
                        {item.type === 'deposit' ? `Deposit Successful!`
                           : item.type === 'withdrawal' ? ` Withdrawal Processed`
                              : item.type === 'tier' ? `Tier Upgrade Confirmed`
                                 : item.type === 'bonus' ? `Auto-Payout Received`
                                    : `New Yield Alert`}
                     </h1>
                     <p className='text-xs font-normal text-(--color2)/50'>
                        {item.type === 'deposit' ? `You just added $${item.amount} to your wallet. Your balance is now growing stronger!`
                           : item.type === 'withdrawal' ? `$${item.amount ?? '0.00'} has been successfully withdrawn to your linked account. Track it in your history.`
                              : item.type === 'tier' ? `Congrats! You’ve moved from ${item.plan?.includes('-')
                                 ? `Congrats! You’ve moved from ${item.plan.split('-')[0]} to ${item.plan.split('-')[1]}. New returns unlocked.`
                                 : `Tier upgrade confirmed for $${item.amount}.`} to ${item.plan?.split('-')[1]}. New returns unlocked.`
                                 : item.type === 'bonus' ? `You just earned $${item.amount} from your daily yield. Keep building your streak!`
                                    : `Your PolyCycle pack just matured. You earned $${item.amount} in total!`}
                     </p>
                  </div>
               </div>
            )) : <p className="text-center text-sm text-white/60">No Transaction Found yet.</p>}
         </div>

      </div>
   )
}

export default page