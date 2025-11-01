'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import team_commission from '@/assets/team-commission.svg'
import copy from 'copy-to-clipboard';
import { showToast } from '@/utils/alert';
import { useUserContext } from '@/store/userContext';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import api from '@/utils/axios';
import { AxiosError } from 'axios';


const TABLEDATA = [
   ['LVL 1', '5%', '1st person Ref'],
   ['LVL 2', '2%', '2st person Ref'],
   ['LVL 3', '1%', '3st person Ref'],
]

const CrewPage = () => {
   const [stack, setStack] = useState(1)
   const [referralCode, setReferralCode] = useState('2GR57DX')
   const [copied, setCopied] = useState(false);
   const { user } = useUserContext()
   const router = useRouter()
   const [crew, setCrew] = useState<CrewType>()

   useEffect(() => {
      setReferralCode(user.referral_code)
      const getCrew = async () => {
         const userToken = Cookies.get("userToken");

         if (!userToken) {
            router.replace("/auth/login");
            return;
         }

         try {
            api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
            const response = await api.get<CrewType>("/crew/");
            console.log(response.data)
            setCrew(response.data)
         } catch (err) {
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred during signup')
            }
         }
      }
      getCrew()
   }, [])

   const handleCopy = (value: string) => {
      copy(value);
      setCopied(true);
      showToast('success', "Copied Successfully")
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div>
         <div className={`text-[#E8E3D3] rounded-[15px] py-[23px] h-fit px-[25px] relative bg-(--color4) mb-3`}>
            {/* <ParticlesBackground /> */}
            <div className="text-[10px] md:text-xs font-light mb-3.5 flex items-center gap-1.5">
               <span>Your Crew, Your Power</span>
            </div>
            <div className="max-w-[652px] flex items-center justify-between gap-1.5 bg-[#696969]/60 rounded-[5px] px-[13px] py-[10px] mb-[5px]">
               <h1 className="text-sm">{`https://novox.app/auth/signup?filter=true&code=${referralCode}`}</h1>
               <button className='cursor-pointer' onClick={() => handleCopy(`https://novox.app/auth/signup?filter=true&code=${referralCode}`)}>
                  <Icon icon='akar-icons:copy' className='text-[20px]' />
               </button>
            </div>
            <div className="max-w-[652px] flex items-center justify-between gap-1.5 bg-[#696969]/60 rounded-[5px] px-[13px] py-[10px]">
               <h1 className="text-sm">{referralCode}</h1>
               <button className='cursor-pointer' onClick={() => handleCopy(referralCode)}>
                  <Icon icon='akar-icons:copy' className='text-[20px]' />
               </button>
            </div>
         </div>
         <div className='bg-[#0000FF] rounded-[20px] py-[22px] px-[25px] mb-3'>
            <div className='flex justify-center mb-6'>
               <h2 className='text-white text-[32.5px] tracking-[0px] font-semibold'>Team Commission</h2>
            </div>
            <div className='font-semibold text-white max-w-[649px] mx-auto'>
               <div className="thead grid grid-cols-[1fr_1fr] justify-items-center text-sm">
                  <div>Level (LVL)</div>
                  <div>RVG (%)</div>
                  {/* <div>CCD</div> */}
               </div>
               <div className='overflow-hidden mt-[10px] text-lg'>
                  {TABLEDATA.map(([item1, item2, item3], index) => (
                     <div key={index} className='grid grid-cols-[1fr_1fr]'>
                        <div className='py-4 border-b border-white text-center'>{item1}</div>
                        <div className='py-4 border-b border-white text-center'>{item2}</div>
                        {/* <div className='py-4 border-b border-white text-center'>{item3}</div> */}
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className='flex gap-2 mb-3 lg:justify-center'>
            {new Array(3).fill("").map((a, i) => <button onClick={() => setStack(i + 1)} className={`text-center flex-1 lg:max-w-[149px] py-3.5 rounded-[20px] shadow-[0px_0px_24px_0px_#6B6B6B/25] transition-all duration-300 text-[#E8E3D3]  ${stack === (i + 1) ? 'bg-[#0000FF]' : 'bg-[#0000FF] opacity-40'}`} key={i + 1}>Level {i + 1}</button>)}
         </div>

         {/* stack */}
         <div className='max-h-[500px] overflow-scroll no-scrollbar flex flex-col gap-3'>
            {stack === 1 && (<>
               {Array.isArray(crew?.members.level_1) && crew.members.level_1.length ? crew?.members.level_1.map(({ userID, level, currentPlan }, i) => (
                  <div key={userID + i} className='py-3 px-[25px] rounded-[15px] bg-[#32323212] flex items-center gap-3'>
                     <div className='w-[50px] h-[50px] flex justify-center items-center bg-[#C7C7C7] rounded-full'>
                        <Icon icon='solar:user-bold' className='text-2xl text-[#fff]' />
                     </div>
                     <div>
                        <h2 className='text-[#00091480] text-sm font-semibold'>User_{userID}</h2>
                        <p className='text-[#00091480] text-xs'>{level}</p>
                        <p className='text-[#00091480] text-xs'>{currentPlan}</p>
                     </div>
                  </div>
               )) : <p className="text-center text-sm text-[#00091480]">No referrals at this level yet.</p>}
            </>)}
            {stack === 2 && (<>
               {Array.isArray(crew?.members.level_2) && crew.members.level_2.length ? crew?.members.level_2.map(({ userID, level, currentPlan }, i) => (
                  <div key={userID + i} className='py-3 px-[25px] rounded-[15px] bg-[#32323212] flex items-center gap-3'>
                     <div className='w-[50px] h-[50px] flex justify-center items-center bg-[#C7C7C7] rounded-full'>
                        <Icon icon='solar:user-bold' className='text-2xl text-[#fff]' />
                     </div>
                     <div>
                        <h2 className='text-[#00091480] text-sm font-semibold'>User_{userID}</h2>
                        <p className='text-[#00091480] text-xs'>{level}</p>
                        <p className='text-[#00091480] text-xs'>{currentPlan}</p>
                     </div>
                  </div>
               )) : <p className="text-center text-sm text[#00091480]">No referrals at this level yet.</p>}
            </>)}
            {stack === 3 && (<>
               {Array.isArray(crew?.members.level_3) && crew.members.level_3.length ? crew?.members.level_3.map(({ userID, level, currentPlan }, i) => (
                  <div key={userID + i} className='py-3 px-[25px] rounded-[15px] bg-[#32323212] flex items-center gap-3'>
                     <div className='w-[50px] h-[50px] flex justify-center items-center bg-[#C7C7C7] rounded-full'>
                        <Icon icon='solar:user-bold' className='text-2xl text-[#fff]' />
                     </div>
                     <div>
                        <h2 className='text-[#00091480] text-sm font-semibold'>User_{userID}</h2>
                        <p className='text-[#00091480] text-xs'>{level}</p>
                        <p className='text-[#00091480] text-xs'>{currentPlan}</p>
                     </div>
                  </div>
               )) : <p className="text-center text-sm text-[#00091480]">No referrals at this level yet.</p>}
            </>)}
         </div>
      </div>
   )
}

export default CrewPage