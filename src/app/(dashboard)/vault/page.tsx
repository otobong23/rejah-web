'use client';
import Vault_List from '@/components/Vault_List';
import { showToast } from '@/utils/alert';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Nunito_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const nunitoSans = Nunito_Sans({
   variable: "--font-nunito_sans",
   subsets: ["latin"],
});

const BUTTON_LIST = [
   'Deposit',
   'Withdraw',
]
const actions = [
   { icon: 'mingcute:history-anticlockwise-fill', label: 'history' },
   { icon: 'lsicon:setting-filled', label: 'setting' },
   { icon: 'flowbite:download-solid', label: 'Download App' },
   { icon: 'material-symbols:shield', label: 'security' }
];
const TOTAL_ASSET = {
   title: 'Total Assets',
   icon: 'tabler:chart-pie-filled',
   details: {
      total_invested: '$10',
      total_yield_earned: '$15',
      total_withdrawn: '$9',
      CRV: '$20',
   }
}
const TEAM_SUMMARY = {
   title: 'Team Summary',
   icon: 'tabler:chart-pie-filled',
   details: {
      total_investment: '$10',
      yield_granted: '$15',
      total_withdrawn: '$9',
      active_members: '64',
   }
}

const VIP = ({ iconColor = 'text-white', bg = 'bg-[#B8FF5E]', number = 1 }) => (
   <div className={`flex items-center gap-1 px-[10px] py-1 rounded-[20px] ${bg}`}>
      <span><Icon icon='streamline:star-badge-solid' className={`text-sm ${iconColor}`} /></span>
      <div className='h-[20px] w-[1px] bg-white block self-stretch'></div>
      <p className='text-sm font-extrabold text-white'>VIP {number}</p>
   </div>
)
const page = () => {
   const router = useRouter()
   const [vip, setVip] = useState<'vip1' | 'vip2' | 'vip3'>('vip2')
   const handleClick = (label: string) => {
      if (label === 'Download App') showToast('warning', 'Not Available Yet')
      else router.push(`/vault/${label}`)
   }
   return (
      <div>
         <div className='py-[34px] px-[15px] rounded-[15px] bg-(--color1) flex items-center gap-3'>
            <div>
               <div className='w-[90px] h-[90px] relative rounded-full bg-[#EFEFEF] flex items-center justify-center'>
                  <Icon icon='solar:user-bold' className='text-5xl text-[#808080]' />
               </div>
            </div>
            <div className={`${nunitoSans.className} w-full text-(--color2)`}>
               <div className={`flex justify-between`}>
                  <h1 className='text-xl font-semibold'>User_694882</h1>
                  <div>
                     {vip === 'vip1' && <VIP iconColor='text-[#295F4B]' />}
                     {vip === 'vip2' && <VIP bg='bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' number={2} />}
                     {vip === 'vip3' && <VIP bg='bg-[linear-gradient(180deg,_#FFD700_0%,_#A56409_128.07%)]' number={3} />}
                  </div>
               </div>
               <p className='text-sm opacity-50'>ID: 4R890B0S</p>
               <p className='text-sm opacity-50'>Phone No: 09028729282</p>
               <div className='w-full relative h-[2px] bg-white/30 mt-[5px]'>
                  <span className='w-2.5 h-2.5 block bg-white/50 rounded-full absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'></span>
                  <p className='z-[99] text-[8px] text-[#003B46] px-2 py-1 rounded-[20px] bg-white leading-tight absolute left-3/12 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>10/1,000</p>
                  <span className='w-2.5 h-2.5 block bg-white/50 rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-50'></span>
               </div>
               <div className='flex justify-between text-[#4C767D] text-[10px] mt-2'>
                  <span>VIP 1</span>
                  <span>VIP 3</span>
               </div>
            </div>
         </div>
         <div className={`pt-[15px] pb-7 flex flex-col gap-3 overflow-y-hidden`}>
            <Vault_List VAULT_LIST={TOTAL_ASSET} />
            <Vault_List VAULT_LIST={TEAM_SUMMARY} bg='bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' iconColor='text-[#F97316]' />
         </div>
         <div className="flex items-center justify-between bg-[#121A24] py-6 px-4 rounded-[15px] gap-3">
            {actions.map(({ icon, label }, index) => (
               <button
                  onClick={() => handleClick(label)}
                  key={index}
                  className="flex flex-col items-center p-3"
               >
                  <div>
                     <Icon icon={icon} className='text-[40px] text-(--color2)' />
                  </div>
                  <p className="text-xs text-center text-white capitalize">{label}</p>
               </button>
            ))}
         </div>
         <div className="flex items-center w-full gap-3 my-3">
            {BUTTON_LIST.map(title => (
               <button key={title} className={`text-(--color2) bg-[#003B46] rounded-[20px] px-4 py-5 flex-1 flex justify-center items-center gap-5 transition-all duration-300`}>
                  {title}
               </button>
            ))}
         </div>
      </div>
   )
}

export default page