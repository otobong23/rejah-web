'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useCallback, useEffect, useState } from 'react'
import Rectangle2 from '@/assets/Rectangle2.svg'
import reja_icon from '@/assets/Mining/Reja_Icon.svg'
import Image from 'next/image'
import Link from 'next/link';
import { useUserContext } from '@/store/userContext';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';

const BUTTON_LIST = [
   'Deposit',
   'Withdraw',
]

const DURATION = 24 * 60 * 60 * 1000 //24 hours

const formatTime = (ms: number | null) => {
   if (ms === null) return '--:--:--';
   const totalSeconds = Math.floor(ms / 1000);
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = totalSeconds % 60;
   return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
   )}:${String(seconds).padStart(2, '0')}`;
};

const page = () => {
   const { user } = useUserContext()
   const [miningActivated, setMiningActivated] = useState(false);
   const [timeLeft, setTimeLeft] = useState<number | null>(null);
   const [wasActive, setWasActive] = useState(false)
   const [confirmModal, setConfirmModal] = useState(false)


   const TIMER_KEY = 'twentyFourHourTimerStart';
   const [active, setActive] = useState(false)
   const startTimer = useCallback(() => {
      const now = Date.now();
      localStorage.setItem(TIMER_KEY, now.toString());
      setActive(true);
   }, []);

   useEffect(() => {
      const startTime = localStorage.getItem(TIMER_KEY);

      if (startTime) {
         setActive(true);
         const interval = setInterval(() => {
            const now = Date.now();
            const endTime = parseInt(startTime) + DURATION;
            const diff = endTime - now;

            if (diff <= 0) {
               setTimeLeft(0);
               clearInterval(interval);
               localStorage.removeItem(TIMER_KEY);
               setWasActive(true)
               setActive(false);
            } else {
               setTimeLeft(diff);
               setWasActive(false)
            }
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [active]);


   function roundUpTo3Decimals(num: number) {
      return Math.ceil(num * 1000) / 1000;
   }


   const handleTotalInvested = (param: TIER_LIST_TYPE[] = []) => param.reduce((total, plan) => {
      const price = Number(plan.details.price.split('$')[1]);
      return total + price;
   }, 0)
   const handleDailyYield = (param: TIER_LIST_TYPE[] = []) => param.reduce((total, plan) => {
      const price = Number(plan.details.daily_yield.split('$')[1]);
      return total + price;
   }, 0);
   const handleROI = (param: TIER_LIST_TYPE[] = []) => param.reduce((total, plan) => {
      const price = Number(plan.details.roi.split('$')[1]);
      return total + price;
   }, 0);

   const handleMine = () => {
      if (!user.currentPlan.length) {
         showToast('info', 'you do not have an active plan')
         return
      }
      if (timeLeft) return

      startTimer()
   }

   const handleUseBalance = async () => {
      await api.post<number>('/transaction/mine', { amount: handleDailyYield(user.currentPlan) });
      setConfirmModal(false)
      showToast('success', 'Daily Yields Claimed successfully')
   };

   useEffect(() => { setMiningActivated(active) }, [active])
   useEffect(() => {
      if (wasActive) {
         setConfirmModal(true)
      }
   }, [wasActive])
   return (
      <div>
         <div className={`fixed top-0 left-0 min-w-screen h-screen p-8 bg-black/70 z-[99] items-center  ${confirmModal ? 'flex' : 'hidden'}`}>
            <div className='w-full py-[75px] text-(--color2) text-sm rounded-[32px] border-2 border-[#F5F5F552]/50 bg-white/5 backdrop-blur-sm flex flex-col item-center px-[50px]'>
               <h1 className='text-center text-[40px] font-bold'>Cycle complete</h1>
               <p className='text-center flex flex-col items-center'>
                  <span>You can now withdraw your earnings or reinvest to start a new cycle.</span>
               </p>
               <button onClick={handleUseBalance}
                  className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition opacity-100 hover:scale-90`}>
                  Claim
               </button>
            </div>
         </div>
         <div className={`bg-white/7 backdrop-blur-md text-(--color2) rounded-[15px] py-[23px] px-[25px] relative`}>
            <div className="text-[10px] font-light mb-1.5 flex items-center gap-1.5">
               <span>Current Reja plan</span>
            </div>
            <div className="flex items-center gap-1.5">
               <h1 className="text-3xl font-bold lg:text-4xl">${handleTotalInvested(user.currentPlan)}</h1>
               <span className="inline-block bg-[#B8FF5E] text-(--color4) text-xs font-semibold px-3 py-1 rounded-full">
                  Launch Tier | Ascend
               </span>
            </div>
            <div className='flex gap-4 mt-2'>
               <div className="flex items-start gap-2">
                  <div><Icon icon="mdi:pickaxe" className="text-xl" /></div>
                  <p className="text-sm">{miningActivated ? '+' + (roundUpTo3Decimals(handleDailyYield(user.currentPlan) / 24)) + '/' : ''}{handleDailyYield(user.currentPlan)}</p>
               </div>
               <div className="flex items-start gap-2">
                  <div><Icon icon="tabler:coin-filled" className="text-xl" /></div>
                  <p className="text-sm">{handleROI(user.currentPlan)}</p>
               </div>
            </div>
            <div className='bg-cover bg-center bg-no-repeat px-[10px] py-[9px] pl-4 absolute right-0 bottom-0 transform translate-y-1/2' style={{
               backgroundImage: `url(${Rectangle2.src})`,
            }}>
               <Link href='/dashboard/tiering/my-ecp' className='text-[#F68A3F]'>My Earnings Cycles</Link>
            </div>
         </div>

         <div className='flex flex-col items-center justify-center mt-[82px] max-w-[647px] mx-auto'>
            <div className='flex flex-col items-center justify-center mb-9'>
               <button className='mb-[38px] clickable transform scale-100' onClick={handleMine}>
                  <div className={`shadow-[0px_0px_119.05px_0px_#B8FF5E4D] w-[196px] h-[196px] rounded-full flex items-center justify-center relative transition-all duration-300 
                  ${miningActivated ? "border-8 border-l-[#9D62D9] border-t-[#6EBA0E] border-b-[#F97316] border-r-[#F97316] rotateMine" : 'bg-[linear-gradient(180deg,_#424748_0%,_#003B46_145.74%)] '}
                     `}>

                     <div className={`w-[157px] h-[157px] rounded-full flex items-center justify-center transform -rotate-45 relative transition-all duration-300 
                        ${miningActivated ? 'bg-[#16171A]' : 'bg-[linear-gradient(177.96deg,_#424748_-27.02%,_#003B46_189.41%)] '}
                        `}>
                        {miningActivated ? (
                           <div className='rotate-45'>
                              <h2 className='text-lg text-center text-(--color2) leading-tight'>Cycling</h2>
                              <h1 className='text-center text-[28px] font-bold text-[#F2F2FA] leading-tight '>${handleTotalInvested(user.currentPlan)}/{handleDailyYield(user.currentPlan)}</h1>
                              <p className='text-center text-xs font-extralight text-[#6EBA0E]'>+{roundUpTo3Decimals(handleDailyYield(user.currentPlan) / 24)}(Per/hr)</p>
                           </div>
                        ) : (<Image src={reja_icon} alt="Reja Icon" className='w-[72px] h-[72px] object-cover transform rotate-45' />)}
                     </div>
                  </div>
               </button>
               <p className='flex justify-center items-center gap-1 text-lg font-semibold text-(--color2)'>
                  <span>{miningActivated ? <Icon icon='ri:hourglass-fill' className='text-[#B8FF5E]' /> : <Icon icon='gravity-ui:thunderbolt-fill' className='text-[#B8FF5E]' />}</span>
                  <span>{miningActivated ? formatTime(timeLeft) + 'hrs Left' : 'Tap to start Cycle'}</span>
               </p>
            </div>

            <div className="flex items-center w-full gap-3 my-3">
               {BUTTON_LIST.map(title => (
                  <Link href={`/dashboard/tiering/${title.toLowerCase()}`} key={title} className={`text-(--color2) bg-[#003B46] rounded-[20px] px-4 py-5 flex-1 flex justify-center items-center gap-5 transition-all duration-300`}>
                     {title}
                  </Link>
               ))}
            </div>

            <div className='text-center bg-(--color1) py-8 px-4 rounded-[20px] w-full'>
               <p className='text-4xl font-black text-(--color1) text-outline'>Coming Soon!</p>
            </div>
         </div>
      </div>
   )
}

export default page
