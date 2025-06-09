'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import Tier_List from '@/components/Tier_List';
import { BUTTON_LIST, PREMIUM_TIER_LIST, REBOUND_TIER_LIST } from '@/constant/Tier';
import { showToast } from '@/utils/alert';
import { useRouter } from 'next/navigation';

const Tier = () => {
   const router = useRouter();
   const [activeTier, setActiveTier] = React.useState('Rebound');
   const handleBuy = (title: string) => {
      showToast('success',`You have purchased the ${title} tier!`);
   }
   return (
      <div>
         <div className={`bg-(--color2) text-(--color1) rounded-xl py-[23px] px-[25px] relative`}>
            <button onClick={() => router.back()} className="text-[10px] font-light mb-1.5 flex items-center gap-1.5">
               <Icon icon='mdi:chevron-left' className="text-2xl" />
               <span>Shape Your Journey.</span>
            </button>
            <div className="flex items-center gap-1.5">
               <Icon icon='fa:recycle' className="text-4xl" />
               <h1 className="text-3xl font-bold lg:text-4xl">Pick Your Tier.</h1>
            </div>
            <p className="mt-1 text-sm">No matter your level, every pack contributes to purpose-driven transformation.</p>
         </div>

         <div className="flex items-center gap-3 mt-3">
            {BUTTON_LIST.map(({ title, icon, iconColor }, index) => (
               <button onClick={() => setActiveTier(title)} key={index} className={`text-(--color2) rounded-[20px] px-4 py-5 flex-1 flex justify-center items-center gap-5 
               ${activeTier === title ? 'bg-(--color1) drop-shadow-2xl drop-shadow-[#6B6B6B40]/25' : 'bg-[#002732]'} transition-all duration-300
               `}>
                  <Icon icon={icon} className="text-2xl" color={iconColor} />
                  <div className="flex flex-col items-end">
                     <span className="text-lg font-semibold">{title}</span>
                     <span className='text-[9px]'>Tiers</span>
                  </div>
               </button>
            ))}
         </div>

         {activeTier === 'Rebound' && <div className={`pt-[15px] pb-7 flex flex-col gap-3 overflow-y-hidden ${activeTier === 'Rebound' ? 'h-fit' : 'h-0'}`}>
            {REBOUND_TIER_LIST.map((item) => <Tier_List TIER_LIST={item} handleBUY={handleBuy} key={item.title} />)}
         </div>}
         {activeTier === 'Premium' && <div className='pt-[15px] pb-7 flex flex-col gap-3'>
            {PREMIUM_TIER_LIST.map((item) => <Tier_List TIER_LIST={item} handleBUY={handleBuy} key={item.title} bg='bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' />)}
         </div>}
         <div className='text-center bg-(--color1) py-8 px-4 rounded-[20px]'>
            <p className='text-4xl font-black text-(--color1) text-outline'>Coming Soon!</p>
         </div>
      </div>
   )
}

export default Tier