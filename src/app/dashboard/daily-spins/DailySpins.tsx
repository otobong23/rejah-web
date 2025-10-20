'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import spin_arrow from '@/assets/spin_arrow.png'
import spin_wheel from '@/assets/spin.png'
import { useUserContext } from '@/store/userContext';
import Cookies from "js-cookie";
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { showToast } from '@/utils/alert';

const DailySpins = () => {
   const router = useRouter();
   const { user, setUser } = useUserContext();
   const [isSpinning, setIsSpinning] = useState(false);

   const handleSpin = useCallback(async () => {
      const userToken = Cookies.get("userToken");

      if (!userToken) {
         router.replace("/auth/login");
         return;
      }

      // Start spinning animation
      setIsSpinning(true);

      try {
         api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
         const response = await api.get<number>('/transaction/spin-wheel');
         
         // Wait for spin animation to complete (3-5 seconds)
         await new Promise(resolve => setTimeout(resolve, 4000));
         
         const getUser = await api.get<UserType>("/profile/");
         setUser(getUser.data);
         console.log(response.data)
         showToast('success', 'Reward Claimed Successfully')
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred during signup')
         }
      } finally {
         // Stop spinning animation
         setIsSpinning(false);
      }
   }, [user, router, setUser])

   // Calculate time REMAINING until 24 hours
   const calculateTimeRemaining = (startTime: number) => {
      const now = Date.now();
      const elapsed = now - startTime;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      // const fiveMinutes = 5 * 60 * 1000;
      const remaining = twentyFourHours - elapsed;

      if (remaining <= 0) {
         return { hours: 0, minutes: 0, seconds: 0, canSpin: true };
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      return { hours, minutes, seconds, canSpin: false };
   }

   const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number, canSpin: boolean }>(() => {
      if (user && user.spinWheelTimerStart) {
         return calculateTimeRemaining(user.spinWheelTimerStart);
      }
      return { hours: 0, minutes: 0, seconds: 0, canSpin: true };
   })

   useEffect(() => {
      if (!user || !user.spinWheelTimerStart) return;

      const timer = setInterval(() => {
         const newTimeLeft = calculateTimeRemaining(user.spinWheelTimerStart);
         setTimeLeft(newTimeLeft);

         if (newTimeLeft.canSpin) {
            clearInterval(timer);
         }
      }, 1000);

      return () => clearInterval(timer);
   }, [user?.spinWheelTimerStart])

   return (
      <div>
         <button onClick={() => router.back()} className='flex items-center gap-2 mb-4'>
            <Icon icon="mdi:chevron-left" className='text-3xl cursor-pointer' />
            Back
         </button>

         <h1 className='text-[#000914] text-[40px] font-bold text-center mb-1'>Daily Spin</h1>
         <p className='text-[#000914] text-sm text-center w-8/10 mx-auto mb-10'>Spin the wheel once a day to claim your daily reward</p>

         <button
            className='w-full py-[23px] text-white text-center text-lg font-semibold bg-[#0000FF] rounded-[20px] mb-12 disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={!timeLeft.canSpin || isSpinning}
            onClick={handleSpin}
         >
            {isSpinning 
               ? 'Spinning...'
               : timeLeft.canSpin
               ? 'Spin now'
               : `Next Spin in ${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`
            }
         </button>

         <div className='flex justify-center mb-4'>
            <Image src={spin_arrow} alt='spin arrow' className='w-[53px] object-cover' />
         </div>
         <div 
            className={`origin-center transform transition-transform ${
               isSpinning ? 'animate-spin-wheel' : ''
            }`}
         >
            <Image src={spin_wheel} alt='spin wheel' className='object-cover' />
         </div>

         <style jsx>{`
            @keyframes spin-wheel {
               0% {
                  transform: rotate(0deg);
               }
               100% {
                  transform: rotate(1800deg);
               }
            }

            .animate-spin-wheel {
               animation: spin-wheel 4s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards;
            }
         `}</style>
      </div>
   )
}

export default DailySpins