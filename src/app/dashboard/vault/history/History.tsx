'use client';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AxiosError } from 'axios';
import { Nunito_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { formatInTimeZone } from 'date-fns-tz';


const nunitoSans = Nunito_Sans({
   variable: "--font-nunito_sans",
   subsets: ["latin"],
});

const FILTER = [
   {
      title: 'All',
      type: 'all',
      stackValue: 1
   }, {
      title: 'Withdraw',
      type: 'withdrawal',
      stackValue: 2
   }, {
      title: 'Deposit',
      type: 'deposit',
      stackValue: 3
   }, {
      title: 'Plans',
      type: 'tier',
      stackValue: 4
   }, {
      title: 'Income',
      type: 'bonus',
      stackValue: 5
   }
]
const getFilterType = (stack: number) => {
   const found = FILTER.find(f => f.stackValue === stack);
   return found?.type ?? 'all';
};

const History = () => {
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
            const response = await api.get<{ transactions: UserTransaction[] }>("/transaction/");
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
      if (type === 'bonus') return transaction.filter(item => item.type === 'bonus' || item.type === 'yield');
      return transaction.filter(item => item.type === type);
   }, [transaction, stack]);

   return (
      <div className={`${nunitoSans.className}`}>
         <button onClick={() => stack > 1 ? setStack(prev => prev - 1) : router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
            <Icon icon='fluent:ios-arrow-24-regular' className="" />
         </button>
         <h1 className="text-[40px] font-bold mb-8">Account History</h1>
         <div className="flex gap-2 my-3 overflow-scroll lg:overflow-auto no-scrollbar">
            {FILTER.map(({ title, type, stackValue }) => (
               <button key={title} onClick={() => setStack(stackValue)} className={`py-2 px-6 rounded-[15px] flex items-center justify-center  ${stack === stackValue ? 'bg-[#00273298]' : 'bg-[#002732]'}`}>{title}</button>
            ))}
         </div>
         <div className='flex flex-col gap-3 overflow-scroll no-scrollbar max-w-[649px] mx-auto'>
            {filteredTransactions.length ? filteredTransactions.map((item, index) => (
               <div key={item.type + index} className='flex py-2.5 px-5 bg-white/7 gap-3 rounded-[15px] items-center'>
                  <div>
                     <Icon
                        icon={
                           item.type === 'deposit' ? 'ant-design:dollar-circle-filled'
                              : item.type === 'withdrawal' ? 'streamline:payment-10-solid'
                                 : item.type === 'tier' ? 'fa6-solid:money-bill-trend-up'
                                    : item.type === 'bonus' ? 'solar:hand-money-bold'
                                       : 'mingcute:notification-fill'
                        }
                        className={`text-4xl ${item.type === 'deposit' ? 'text-[#3B82F6]'
                           : item.type === 'withdrawal' ? 'text-[#10B981]'
                              : item.type === 'tier' ? 'text-[#8B5CF6]'
                                 : item.type === 'bonus' ? 'text-[#F59E0B]'
                                    : 'text-[#F94E4E]'}`}
                     />
                  </div>

                  <div className='flex-1 text-(--color2)'>
                     <div className='flex items-center justify-between'>
                        <h1 className='text-sm font-semibold mb-1 capitalize'>
                           {/* Dynamic heading using type and status */}
                           {item.type} - ${item.amount.toLocaleString()}
                        </h1>
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full 
          ${item.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400'
                              : item.status === 'completed' ? 'bg-green-400/20 text-green-400'
                                 : 'bg-red-400/20 text-red-400'}
        `}>
                           {item.status}
                        </span>
                     </div>

                     <p className='text-xs font-normal text-(--color2)/50'>
                        {(() => {
                           const amt = `$${item.amount}`;
                           const status = item.status;
                           const plan = item.plan ?? '';

                           switch (item.type) {
                              case 'deposit':
                                 return status === 'pending'
                                    ? `You initiated a deposit of ${amt}. Awaiting confirmation.`
                                    : status === 'completed'
                                       ? `You successfully deposited ${amt} into your account.`
                                       : `Deposit of ${amt} failed. Please try again.`;

                              case 'withdrawal':
                                 return status === 'pending'
                                    ? `You requested a withdrawal of ${amt}. Processing...`
                                    : status === 'completed'
                                       ? `${amt} has been successfully withdrawn.`
                                       : `Withdrawal of ${amt} failed. Contact support if unresolved.`;

                              case 'tier':
                                 if (plan.includes('-')) {
                                    const [from, to] = plan.split('-');
                                    return status === 'completed'
                                       ? `Your plan was upgraded from ${from} to ${to}.`
                                       : `Tier upgrade (${from} → ${to}) is ${status}.`;
                                 }
                                 return `Tier change of ${amt} is ${status}.`;

                              case 'bonus':
                                 return status === 'completed'
                                    ? `You received a bonus of ${amt}.`
                                    : `Bonus payout of ${amt} is ${status}.`;

                              case 'yield':
                                 return `Yield reward of ${amt} is currently ${status}.`;

                              default:
                                 return `Transaction of ${amt} is currently ${status}.`;
                           }
                        })()}
                     </p>
                     <p className='text-xs font-normal text-(--color2)/50 mt-2'>{formatInTimeZone(item.updatedAt ?? Date.now(), 'UTC', 'dd/MM/yy, HH:mm')}</p>
                  </div>
               </div>
            )) : <p className="text-center text-sm text-white/60">No Transaction Found yet.</p>}

         </div>

      </div>
   )
}

export default History