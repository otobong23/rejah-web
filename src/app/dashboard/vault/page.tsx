'use client';
import Vault_List from '@/components/Vault_List';
import { PREMIUM_TIER_LIST, REBOUND_TIER_LIST } from '@/constant/Tier';
import { useUserContext } from '@/store/userContext';
import { showToast } from '@/utils/alert';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Nunito_Sans } from 'next/font/google';
import Link from 'next/link';
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


const VIP = ({ iconColor = 'text-white', bg = 'bg-[#B8FF5E]', number = 1 }) => (
   <div className={`flex items-center gap-1 px-[10px] py-1 rounded-[20px] ${bg}`}>
      <span><Icon icon='streamline:star-badge-solid' className={`text-sm ${iconColor}`} /></span>
      <div className='h-[20px] w-[1px] bg-white block self-stretch'></div>
      <p className='text-sm font-extrabold text-white'>VIP {number}</p>
   </div>
)
const page = () => {
   const { user } = useUserContext()
   const router = useRouter()

   const handlePlans = (param: UserType) => {
      const plans = param.currentPlan || []; // Default to empty array if undefined
      const Rebound: TIER_LIST_TYPE[] = REBOUND_TIER_LIST.filter(a =>
         plans.includes(a.title)
      );
      const Premium: TIER_LIST_TYPE[] = PREMIUM_TIER_LIST.filter(a =>
         plans.includes(a.title)
      );
      return [...Rebound, ...Premium];
   }

   const handleCRV = (plans: TIER_LIST_TYPE[]) => {
      let CRV: number = 0
      plans.forEach(a => {
         const daily_yield = Number(a.details.daily_yield.split('$')[1])
         const duration = Number(a.details.duration.split(' ')[0])
         CRV += duration * daily_yield
      })
      return CRV
   }

   const CRV = () => {
      const plans = handlePlans(user)
      const crv = handleCRV(plans)
      return crv
   }

   const TOTAL_ASSET = {
      title: 'Total Assets',
      icon: 'tabler:chart-pie-filled',
      details: {
         total_invested: '$' + user.totalDeposit,
         total_yield_earned: '$' + user.totalYield,
         total_withdrawn: '$' + user.totalWithdraw,
         CRV: '$' + CRV(),
      }
   }

   const handleClick = (label: string) => {
      if (label === 'Download App') showToast('warning', 'Not Available Yet')
      else router.push(`/dashboard/vault/${label}`)
   }
   return (
      <div>
         <div className='py-[34px] lg:py-[52px] px-[15px] lg:px-[73px] rounded-[15px] lg:rounded-[23px] bg-(--color1) flex items-center gap-3'>
            <div>
               <div className='w-[90px] lg:w-[151px] h-[90px] overflow-hidden lg:h-[151px] relative rounded-full bg-[#EFEFEF] flex items-center justify-center'>
                  {user.profileImage
                     ? <img src={user.profileImage} alt="Profile preview" className='w-full object-cover' />
                     : <Icon icon="solar:user-bold" className='text-[#808080]' width={48} />}
               </div>
            </div>
            <div className={`${nunitoSans.className} w-full text-(--color2)`}>
               <div className={`flex justify-between`}>
                  <h1 className='text-xl lg:text-4xl font-semibold'>User_<span className='uppercase'>{user.userID}</span></h1>
                  <div>
                     {user.vip === 0 && ''}
                     {user.vip === 1 && <VIP iconColor='text-[#295F4B]' />}
                     {user.vip === 2 && <VIP bg='bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' number={2} />}
                     {user.vip === 3 && <VIP bg='bg-[linear-gradient(180deg,_#FFD700_0%,_#A56409_128.07%)]' number={3} />}
                  </div>
               </div>
               <p className='text-sm lg:text-lg opacity-50'>ID: <span className='uppercase'>{user.userID}</span></p>
               <p className='text-sm lg:text-lg opacity-50'>Phone No: {user.whatsappNo ? user.whatsappNo : 'Unknown'}</p>
               <div className='w-full relative h-[2px] bg-white/30 mt-[5px]'>
                  <span className='w-2.5 h-2.5 block bg-white/50 rounded-full absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'></span>
                  <p className='z-[99] text-[8px] text-[#003B46] px-2 py-1 rounded-[20px] bg-white leading-tight absolute left-3/12 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>10/1,000</p>
                  <span className='w-2.5 h-2.5 block bg-white/50 rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-50'></span>
               </div>
               <div className='flex justify-between text-[#4C767D] text-[10px] lg:text-lg mt-2'>
                  <span>VIP 1</span>
                  <span>VIP 3</span>
               </div>
            </div>
         </div>
         <div className={`pt-[15px] pb-7 flex flex-col lg:flex-row gap-3 overflow-y-hidden`}>
            <Vault_List VAULT_LIST={TOTAL_ASSET} />
         </div>
         <div className="flex items-center justify-between bg-[#121A24] py-6 lg:py-[52px] px-4 lg:px-32 rounded-[15px] gap-3">
            {actions.map(({ icon, label }, index) => (
               <button
                  onClick={() => handleClick(label)}
                  key={index}
                  className="flex flex-col items-center p-3"
               >
                  <div>
                     <Icon icon={icon} className='text-[40px] lg:text-[52px] text-(--color2)' />
                  </div>
                  <p className="text-xs lg:text-base text-center text-white capitalize">{label}</p>
               </button>
            ))}
         </div>
         <div className="flex items-center lg:not-visited:justify-center w-full gap-3 my-3">
            {BUTTON_LIST.map(title => (
               <Link href={`/dashboard/tiering/${title.toLowerCase()}`} key={title} className={`text-(--color2) bg-[#003B46] rounded-[20px] px-4 py-5 flex-1 max-w-[316px] flex justify-center items-center gap-5 transition-all duration-300`}>
                  {title}
               </Link>
            ))}
         </div>
      </div>
   )
}

export default page