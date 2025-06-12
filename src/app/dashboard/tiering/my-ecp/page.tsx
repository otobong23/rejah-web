"use client";
import Tier_List from '@/components/Tier_List';
import { REBOUND_TIER_LIST } from '@/constant/Tier';
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import nova from '@/assets/Tier/Nova.png'
import poly from '@/assets/Tier/PolyCycle.png'

const active_tier: TIER_LIST_TYPE[] = [
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
    },
    expiring_date: ''
  },
  {
    type: 'premium_tier',
    title: 'Nova',
    image: nova,
    details: {
      price: '$5,000',
      daily_yield: '$12',
      duration: '180 Days',
      roi: '$2,160',
      purchase_limit: '1'
    },
    expiring_date: ''
  },
];
const expired_tier: TIER_LIST_TYPE[] = [];

const page = () => {
  const router = useRouter()
  const [option, setOption] = React.useState('active');
  const No_data_yet = <h2 className='mt-28 text-center'>no data yet</h2>
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
          {active_tier.length ? active_tier.map((item) => <Tier_List TIER_LIST={item} key={item.title} bg={item.type === 'premium_tier' ? 'bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' : 'bg-(--color1)'} />) : No_data_yet}
        </div>}
        {option === 'expired' && <div className='pt-[15px] pb-7 flex flex-col gap-3'>
          {expired_tier.length ? expired_tier.map((item) => <div className='opacity-40'><Tier_List TIER_LIST={item} key={item.title} bg={item.type === 'premium_tier' ? 'bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' : 'bg-(--color1)'} /></div>) : No_data_yet}
        </div>}
      </div>
    </div>
  )
}

export default page