'use client';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { PREMIUM_TIER_LIST, REBOUND_TIER_LIST } from '@/constant/Tier';
import { VIP } from '@/components/VIP';

const page = () => {
   const router = useRouter()
   const { userID } = useParams()
   const [ crew, setCrew ] = useState<CrewType>()
   const [user, setUser] = useState<UserType>()

   useEffect(() => {
    const getCrews = async () => {
      const adminToken = Cookies.get("adminToken");

      if (!adminToken) {
        router.replace("/admin/auth/login");
        return;
      }
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
        const response = await api.get<CrewType>(`/admin/crew?userID=${userID}`);
        const userResponse = await api.get<UserType>(`/admin/user?userID=${userID}`);
        setCrew(response.data);
        setUser(userResponse.data)
      } catch (err) {
        if (err instanceof AxiosError) {
          showToast('error', err.response?.data.message)
        } else {
          showToast('error', 'An error occurred')
        }
      }
    };
    getCrews()
  }, [])

  const handlePlans = (param: UserType) => {
        const plans = param.currentPlan || []; // Default to empty array if undefined
        const Rebound: TIER_LIST_TYPE[] = REBOUND_TIER_LIST.filter(a =>
           plans?.some(b => b.title === a.title)
        );
        const Premium: TIER_LIST_TYPE[] = PREMIUM_TIER_LIST.filter(a =>
           plans?.some(b => b.title === a.title)
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
     const handleTotalInvested = (param: TIER_LIST_TYPE[]) => {
        const plans = param || [];
        let totalInvested = 0
        plans.forEach(a => {
           const price = Number(a.details.price.split('$')[1])
           totalInvested += price
        })
        return totalInvested
     }
  
     const CRV = () => {
        if (!user) return 0;
        const plans = handlePlans(user)
        const crv = handleCRV(plans)
        return crv
     }

     const handleText = () => {
      const tc = crew?.totalCrewDeposits ?? 0;
      let level = 0;

      if (tc < 3000) {
         level = 3000
      } else if (tc >= 3000 && tc < 5000) {
         level = 5000
      }else {
         level = 1000;
      }
      return level
   }

   return (
      <div className='text-(--color2)'>
         <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 mb-2 cursor-pointer hover:opacity-80 transition-all duration-300"
         >
            <Icon icon="fluent:ios-arrow-24-regular" />
         </button>
         <div className='flex justify-between items-center pb-10'>
            <h1 className="text-[40px] font-bold">Crew_{userID}</h1>
            <div className='flex items-center justify-center'>
               <div className='w-[49px] h-[49px] rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
                  <Icon icon="solar:user-bold" className='text-[#808080]' width={23} />
               </div>
            </div>
         </div>

         <div className='px-4 py-7 rounded-[15px] bg-(--color1)/70 text-sm mb-10'>
            <h1 className='flex justify-between items-center text-2xl font-semibold'>
               <span>LVL</span>
               <span>
                  {user?.vip === 0 && ''}
                  {user?.vip === 1 && <VIP iconColor='text-[#295F4B]' />}
                  {user?.vip === 2 && <VIP bg='bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' number={2} />}
                  {user?.vip === 3 && <VIP bg='bg-[linear-gradient(180deg,_#FFD700_0%,_#A56409_128.07%)]' number={3} />}
               </span>
            </h1>
            <p>Crew: {[...(crew?.members.level_1 ?? []), ...(crew?.members.level_2 ?? []), ...(crew?.members.level_3 ?? [])].length.toLocaleString()} Members</p>
            <p>Active: {[...(crew?.members.level_1 ?? []), ...(crew?.members.level_2 ?? []), ...(crew?.members.level_3 ?? [])].length.toLocaleString()} Members</p>
            <div className='w-full relative h-[2px] bg-white/30 mt-[5px]'>
               <span className='w-2.5 h-2.5 block bg-white/50 rounded-full absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'></span>
               <p className='z-[99] text-[8px] text-[#003B46] px-2 py-1 rounded-[20px] bg-white leading-tight absolute top-1/2 transform -translate-y-1/2' style={{
                  left: (user?.meter ?? 0) + '%'
               }}>{crew?.totalCrewDeposits}/{handleText()}</p>
               <span className='w-2.5 h-2.5 block bg-white/50 rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-50'></span>
               <div className='flex justify-between text-[#4C767D] text-xs lg:text-lg mt-3'>
                  {user?.vip === 0 && <>
                     <span></span>
                     <span>VIP 1</span>
                  </>}
                  {user?.vip === 1 && <>
                     <span>VIP 1</span>
                     <span>VIP 2</span>
                  </>}
                  {user?.vip === 2 && <>
                     <span>VIP 2</span>
                     <span>VIP 3</span>
                  </>}
                  {user?.vip === 3 && <>
                     <span>VIP 2</span>
                     <span>VIP 3</span>
                  </>}
               </div>
            </div>
         </div>
         <div>
            <div className='flex items-center justify-between text-[#A8A79E] text-lg pb-3'>
               <p>Total Invested:</p>
               <p className='text-(--color2) font-bold'>{handleTotalInvested(user?.currentPlan ?? []).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className='flex items-center justify-between text-[#A8A79E] text-lg pb-3'>
               <p>Total Yield Earned:</p>
               <p className='text-(--color2) font-bold'>{user?.totalYield.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className='flex items-center justify-between text-[#A8A79E] text-lg pb-3'>
               <p>Total Withdrawn:</p>
               <p className='text-(--color2) font-bold'>{user?.totalWithdraw.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div className='flex items-center justify-between text-[#A8A79E] text-lg pb-3'>
               <p>CRV:</p>
               <p className='text-(--color2) font-bold'>{CRV().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
         </div>
      </div>
   )
}

export default page