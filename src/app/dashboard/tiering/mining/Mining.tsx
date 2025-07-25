'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import Rectangle2 from '@/assets/Rectangle2.svg'
import reja_icon from '@/assets/Mining/Reja_Icon.svg'
import Image from 'next/image'
import Link from 'next/link';
import { useUserContext } from '@/store/userContext';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';


const BUTTON_LIST = [
   'Deposit',
   'Withdraw',
]

const DURATION = 24 * 60 * 60 * 1000 //24 hours
// const DURATION = 1 * 1 * 60 * 1000 //1 minutes

const formatTime = (ms: number | null) => {
   if (ms === null) return '--:--:--';
   const totalSeconds = Math.floor(ms / 1000);
   const h = Math.floor(totalSeconds / 3600);
   const m = Math.floor((totalSeconds % 3600) / 60);
   const s = totalSeconds % 60;
   return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const MiningPage = () => {

   const { user, setUser } = useUserContext()
   const [miningActivated, setMiningActivated] = useState(false);
   const [timeLeft, setTimeLeft] = useState<number | null>(null);
   const [wasActive, setWasActive] = useState(false)
   const router = useRouter();

   // Add refs to prevent double execution
   const isProcessingClaim = useRef(false);
   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const hasInitialized = useRef(false);

   const updateTimer = async (params: string) => {
      try {
         const response = await api.patch<UserType>('/profile/update', { twentyFourHourTimerStart: params })
         setUser(response.data)
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred')
         }
      }
   }

   const [active, setActive] = useState(false)

   const startTimer = useCallback(() => {
      const now = Date.now();
      updateTimer(now.toString()).then(() => {
         setActive(true)
      }).catch(() => {
         setActive(false);
         setTimeLeft(null);
      });
   }, []);

   useEffect(() => {
      const fetchUser = async () => {
         const userToken = Cookies.get("userToken");

         if (!userToken) {
            router.replace("/auth/login");
            return;
         }
         try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get<UserType>('/profile/'); // Make sure this returns the full user
            setUser(response.data);
         } catch (err) {
            console.error('Failed to fetch user on mount:', err);
         }
      };

      fetchUser();
   }, []);

   // Fixed timer logic with proper cleanup
   useEffect(() => {
      if (!user || !user.twentyFourHourTimerStart) return;
      const startTime = user.twentyFourHourTimerStart;

      // Clear any existing interval
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      }

      if (!startTime) {
         setActive(false);
         setTimeLeft(null);
         setWasActive(false);
         return;
      }

      const startTimeNum = parseInt(startTime);
      if (isNaN(startTimeNum)) {
         setActive(false);
         setTimeLeft(null);
         setWasActive(false);
         return;
      }

      setActive(true);

      const updateTimerState = () => {
         const now = Date.now();
         const endTime = startTimeNum + DURATION;
         const diff = endTime - now;

         if (diff <= 0) {
            setTimeLeft(0);
            setActive(false);

            // Only set wasActive if we haven't already processed this completion
            if (!isProcessingClaim.current) {
               setWasActive(true);
            }

            if (intervalRef.current) {
               clearInterval(intervalRef.current);
               intervalRef.current = null;
            }
         } else {
            setTimeLeft(diff);
            setWasActive(false);
         }
      };

      // Initial update
      updateTimerState();

      // Set up interval
      intervalRef.current = setInterval(updateTimerState, 1000);

      // Mark as initialized after first render
      if (!hasInitialized.current) {
         hasInitialized.current = true;
      }

      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
         }
      };
   }, [user]); // Only depend on the timer value

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
      if (user.ActivateBot) {
         if (!user.currentPlan.length) {
            showToast('info', 'you do not have an active plan')
            return
         }
         if (timeLeft !== null && timeLeft > 0) return;

         startTimer()
      } else {
         showToast('warning', 'Your account has been suspended. Please Vist Customer Care')
      }
   }

   const handleUseBalance = async () => {
      if (isProcessingClaim.current) {
         return; // Prevent double execution
      }

      isProcessingClaim.current = true;

      try {
         await api.post<number>('/transaction/mine', { amount: handleDailyYield(user.currentPlan) });
         showToast('success', 'Daily Yields Claimed successfully')
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred')
         }
      } finally {
         isProcessingClaim.current = false;
      }
   };

   // Set mining activated state
   useEffect(() => {
      setMiningActivated(active)
   }, [active])

   // Handle completion with proper cleanup
   useEffect(() => {
      if (wasActive && !isProcessingClaim.current) {
         const delay = setTimeout(() => {
            handleUseBalance().then(() => {
               updateTimer('').then(() => {
                  setWasActive(false);
                  setActive(false);
               });
            });
         }, 500); // wait 500ms before executing

         return () => clearTimeout(delay); // cleanup
      }
   }, [wasActive])

   return (
      <div>
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

export default MiningPage