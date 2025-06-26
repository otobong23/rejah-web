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
               <div key={item.type + index} className='flex flex-col py-2.5 px-5 bg-white/7 gap-3 rounded-[15px]'>
                  <div className='flex justify-between'>
                     <h1 className='text-sm font-semibold mb-1 capitalize'>
                        {item.type} {item.status === 'pending' ? 'pending' : item.status === 'completed' ? 'successful' : 'failed'}
                     </h1>
                     <p>${item.amount.toLocaleString()}</p>
                  </div>
                  <div className='flex justify-between text-xs font-normal text-(--color2)/50'>
                     <p>{formatInTimeZone(item.updatedAt ?? Date.now(), 'Africa/Lagos', 'HH:mm')}</p>
                     <p>{formatInTimeZone(item.updatedAt ?? Date.now(), 'Africa/Lagos', 'dd/MM/yy')}</p>
                  </div>
               </div>
            )) : <p className="text-center text-sm text-white/60">No Transaction Found yet.</p>}
         </div>
      </div>
   )
}

export default History