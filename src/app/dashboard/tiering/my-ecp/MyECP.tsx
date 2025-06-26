"use client";
import Tier_List from '@/components/Tier_List';
import { REBOUND_TIER_LIST, PREMIUM_TIER_LIST } from '@/constant/Tier';
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useUserContext } from '@/store/userContext';
import { differenceInCalendarDays } from 'date-fns';


const getRemainingDays = (date?: string) => {
  if (!date) return 0;
  const expiry = new Date(date);
  if (isNaN(expiry.getTime())) return 0;
  return Math.max(0, differenceInCalendarDays(expiry, new Date()));
};

const MyECP = () => {
  const { user } = useUserContext()
  const router = useRouter()
  const [option, setOption] = useState('active');
  const No_data_yet = <h2 className='mt-28 text-center'>no data yet</h2>
  const plans = [...REBOUND_TIER_LIST, ...PREMIUM_TIER_LIST]
  let currentPlans = plans.filter(a =>
    user.currentPlan?.some(b => b.title === a.title)
  );
  let previousPlans = plans.filter(a =>
    user.previousPlan?.some(b => b.title === a.title)
  );

  currentPlans = currentPlans.map(item => {
    const userItem = user.currentPlan?.find(b => b.title === item.title)
    return ({
      ...item, details: {
        ...item.details, duration: getRemainingDays(userItem?.expiring_date ?? '') + ' days'
      }
    })
  })
  previousPlans = previousPlans.map(item => {
    const userItem = user.previousPlan?.find(b => b.title === item.title)
    return ({
      ...item, details: {
        ...item.details, duration: getRemainingDays(userItem?.expiring_date ?? '') + ' days'
      }
    })
  })
  return (
    <div>
      {/* Header */}
      <button onClick={() => router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
        <Icon icon='fluent:ios-arrow-24-regular' className="" />
      </button>
      <h1 className="text-[40px] font-bold mb-8">My Earning Cycles</h1>

      <div className="flex items-center gap-3 mt-3 max-w-[570px] mx-auto">
        {['active', 'expired'].map((item, index) => (
          <button onClick={() => setOption(item)} key={index} className={`text-(--color2) rounded-[20px] px-4 py-5 flex-1 flex justify-center items-center gap-5 
                     ${option === item ? 'bg-(--color1) drop-shadow-2xl drop-shadow-[#6B6B6B40]/25' : 'bg-[#002732]'} transition-all duration-300
                     `}>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold capitalize">{item}</span>
              {/* <span className='text-[9px]'>Tiers</span> */}
            </div>
          </button>
        ))}
      </div>

      <div className='max-w-[570px] mx-auto'>
        {option === 'active' && <div className={`pt-[15px] pb-7 flex flex-col gap-3 overflow-y-hidden ${option === 'active' ? 'h-fit' : 'h-0'}`}>
          {currentPlans.length ? currentPlans.map((item) => <Tier_List TIER_LIST={item} key={item.title} bg={item.type === 'premium_tier' ? 'bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' : 'bg-(--color1)'} />) : No_data_yet}
        </div>}
        {option === 'expired' && <div className='pt-[15px] pb-7 flex flex-col gap-3'>
          {previousPlans.length ? previousPlans.map((item) => <div className='opacity-40'><Tier_List TIER_LIST={item} key={item.title} bg={item.type === 'premium_tier' ? 'bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' : 'bg-(--color1)'} /></div>) : No_data_yet}
        </div>}
      </div>
    </div>
  )
}

export default MyECP