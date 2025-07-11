'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import Tier_List from '@/components/Tier_List';
import { BUTTON_LIST, PREMIUM_TIER_LIST, REBOUND_TIER_LIST } from '@/constant/Tier';
import { showToast } from '@/utils/alert';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/store/userContext';
import { useLoader } from '@/store/LoaderContext';
import api from '@/utils/axios';
import { AxiosError } from 'axios';

const TierPage = () => {
   const { showPageLoader, hidePageLoader } = useLoader()
   const { user, setUser } = useUserContext()
   const router = useRouter();
   const [activeTier, setActiveTier] = useState('Rebound');
   const [purchaseDetails, setPurchaseDetails] = useState<TIER_LIST_TYPE | null>(null)
   const [confirmModal, setConfirmModal] = useState(false)
   const [processingModal, setProcessingModal] = useState(false)
   const [seconds, setSeconds] = useState(0); // countdown

   const plans = [...REBOUND_TIER_LIST, ...PREMIUM_TIER_LIST]
   const currentPlans = plans.filter(a =>
      user.currentPlan?.some(b => b.title === a.title)
   );
   const previousPlans = plans.filter(a =>
      user.previousPlan?.some(b => b.title === a.title)
   );
   const handleClick = (TIER: TIER_LIST_TYPE) => {
      setConfirmModal(true)
      setPurchaseDetails(TIER)
   }
   const handleModalButton = async (action: 'proceed' | 'cancel') => {
      if (action === 'cancel') {
         return setConfirmModal(false);
      }

      if (action === 'proceed') {
         setConfirmModal(false);

         try {
            if (user.ActivateBot) {
               await validateUserBalance();
               await beginProcessing();

               await startCountdown(10); // 30 seconds for demo

               await finalizePurchase();
            } else {
               showToast('warning', 'Your account has been suspended. Please Vist Customer Care')
            }
         } catch (error: any) {
            showToast('error', error.message || 'Something went wrong.');
            setProcessingModal(false);
         }
      }
   };

   // ──────────────────────────────
   // Promise-based helper functions
   // ──────────────────────────────

   const validateUserBalance = (): Promise<void> => {
      return new Promise((resolve, reject) => {
         if (!user.balance || user.balance < (Number(purchaseDetails?.details.price.split('$')[1]) || 0)) {
            reject(new Error('Insufficient deposit balance. Please fund your account.'));
         } else {
            resolve();
         }
      });
   };

   const beginProcessing = (): Promise<void> => {
      return new Promise((resolve) => {
         setProcessingModal(true);
         resolve();
      });
   };

   const startCountdown = (duration: number): Promise<void> => {
      return new Promise((resolve) => {
         setSeconds(duration);
         const countdown = setInterval(() => {
            setSeconds((prev) => {
               if (prev <= 1) {
                  clearInterval(countdown);
                  resolve();
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      });
   };

   const finalizePurchase = (): Promise<void> => {
      return new Promise(async (resolve) => {
         showPageLoader()
         try {
            const useBalance = await api.post<number>('/transaction/getPlan', { amount: Number(purchaseDetails?.details.price.split('$')[1]), plan: purchaseDetails?.title })
            console.log(useBalance.status)
            const today = new Date();
            const expiringDate = new Date(today);
            expiringDate.setDate(today.getDate() + Number(purchaseDetails?.details.duration.split(' ')[0]));
            const response = await api.patch<UserType>('/profile/update-plan', {
               type: purchaseDetails?.type || '', title: purchaseDetails?.title || '', details: purchaseDetails?.details || '', expiring_date: expiringDate || ''
            })
            setUser(response.data)
            hidePageLoader()
            showToast('success', 'Your pack has been successfully activated. Daily yields will now begin.');
         } catch (err) {
            hidePageLoader()
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred during signup')
            }
         }
         setProcessingModal(false);
         resolve();
      });
   };
   return (
      <div>
         <div className={`fixed top-0 left-0 min-w-screen h-screen bg-black/70 z-[99] items-end ${confirmModal ? 'flex' : 'hidden'}`}>
            <div className='py-[63px] px-[50px] w-full flex flex-col justify-center bg-[#000914] rounded-t-[50px]'>
               <div className='mb-[50px] text-(--color2) text-sm leading-relaxed'>
                  <h1 className='text-center text-[40px] font-bold text-(--color2)'>Confirm</h1>
                  <p>You&apos;ve selected the ASCEND pack.</p>
                  <ul className='list-disc'>
                     <li>
                        <div className='flex justify-between'>
                           <span>Price:</span>
                           <span>{purchaseDetails?.details.price}</span>
                        </div>
                     </li>
                     <li>
                        <div className='flex justify-between'>
                           <span>Daily Yield:</span>
                           <span>{purchaseDetails?.details.daily_yield}</span>
                        </div>
                     </li>
                     <li>
                        <div className='flex justify-between'>
                           <span>Duration:</span>
                           <span>{purchaseDetails?.details.duration}</span>
                        </div>
                     </li>
                     <li>
                        <div className='flex justify-between'>
                           <span>Total (MM) Yield:</span>
                           <span>{purchaseDetails?.details.roi}</span>
                        </div>
                     </li>
                  </ul>
                  <div className='flex gap-2 items-center'>
                     <h1 className='text-[40px] font-bold'>{purchaseDetails?.details.price}</h1>
                     <span className='px-2.5 text-[#000914] bg-[#B8FF5E] py-1 rounded-[20px] leading-tight'>Launch Tier | Ascend</span>
                  </div>
               </div>
               <div className='flex gap-2.5'>
                  {(['proceed', 'cancel'] as ('proceed' | 'cancel')[]).map(item => (
                     <button key={item} onClick={() => handleModalButton(item)} className={`flex-1 flex justify-center py-[17px] rounded-[15px] text-lg tracking-wide font-bold text-white ${item === 'proceed' ? 'bg-[#6EBA0E]' : 'bg-[#C0C0C063]'}`}>{item}</button>
                  ))}
               </div>
            </div>
         </div>

         <div className={`fixed top-0 left-0 min-w-screen h-screen p-8 bg-black/70 z-[99] items-center  ${processingModal ? 'flex' : 'hidden'}`}>
            <div className='w-full py-[75px] text-(--color2) text-sm rounded-[32px] border-2 border-[#F5F5F552]/50 bg-white/5 backdrop-blur-sm flex flex-col item-center px-[50px]'>
               <h1 className='text-center text-[40px] font-bold'>Processing</h1>
               <p className='text-center flex flex-col items-center'>
                  <span>Purchase processing & will be uploaded in</span>
                  <span className='flex'>
                     {seconds > 0 ? `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}` : '00:00'}
                     <span className='w-5 h-5 border border-r-transparent border-[var(--color2)] rounded-full flex items-center justify-center animate-spin'>
                        <span className='w-3 h-3 block border border-l-transparent border-[var(--color2)] rounded-full animate-spin'></span>
                     </span>
                  </span>
               </p>

            </div>
         </div>

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

         <div className="flex items-center gap-3 mt-3 max-w-[570px] mx-auto">
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

         <div className='max-w-[570px] mx-auto'>
            {activeTier === 'Rebound' && <div className={`pt-[15px] pb-7 flex flex-col gap-3 overflow-y-hidden ${activeTier === 'Rebound' ? 'h-fit' : 'h-0'}`}>
               {REBOUND_TIER_LIST.filter(item => ![...previousPlans, ...currentPlans].includes(item)).map((item, i) => <Tier_List TIER_LIST={item} handleBUY={handleClick} key={item.title + i} />)}
            </div>}
            {activeTier === 'Premium' && <div className='pt-[15px] pb-7 flex flex-col gap-3'>
               {PREMIUM_TIER_LIST.filter(item => ![...previousPlans, ...currentPlans].includes(item)).map((item, i) => <Tier_List TIER_LIST={item} handleBUY={handleClick} key={item.title + i} btn_bg='bg-[linear-gradient(180deg,_#F59E0B_0%,_#F94E4E_100%)]' bg='bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' />)}
            </div>}
            <div className='text-center bg-(--color1) py-8 px-4 rounded-[20px]'>
               <p className='text-4xl font-black text-(--color1) text-outline'>Coming Soon!</p>
            </div>
         </div>
      </div>
   )
}

export default TierPage