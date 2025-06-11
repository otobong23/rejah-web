'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
// import Rectangle1 from '@/assets/Rectangle1.svg'
import Rectangle2 from '@/assets/Rectangle2.svg'
import reja_icon from '@/assets/Mining/Reja_Icon.svg'
import Image from 'next/image'
import Link from 'next/link';

const BUTTON_LIST = [
   'Deposit',
   'Withdraw',
]

const page = () => {
   const [miningActivated, setMiningActivated] = useState(false);
   const [timer, setTimer] = useState('24hrs');
   return (
      <div>
         <div className={`bg-white/7 text-(--color2) rounded-[15px] py-[23px] px-[25px] relative`}>
            <div className="text-[10px] font-light mb-1.5 flex items-center gap-1.5">
               <span>Current Reja plan</span>
            </div>
            <div className="flex items-center gap-1.5">
               <h1 className="text-3xl font-bold lg:text-4xl">$10</h1>
               <span className="inline-block bg-[#B8FF5E] text-(--color4) text-xs font-semibold px-3 py-1 rounded-full">
                  Launch Tier | Ascend
               </span>
            </div>
            <div className='flex gap-4 mt-2'>
               <div className="flex items-start gap-2">
                  <div><Icon icon="mdi:pickaxe" className="text-xl" /></div>
                  <p className="text-sm">{miningActivated ? '+0.14/' : ''}0.05</p>
               </div>
               <div className="flex items-start gap-2">
                  <div><Icon icon="fluent:people-24-filled" className="text-xl" /></div>
                  <p className="text-sm">29 Days Left</p>
               </div>
            </div>
            {/* <div className='bg-cover bg-center bg-no-repeat px-[10px] py-[9px] pl-4 absolute right-0 bottom-0 transform translate-y-1/2' style={{
               backgroundImage: `url(${Rectangle2.src})`,
            }}>
               <p className='text-[#F68A3F]'>Min withdrawal | $5</p>
            </div> */}
         </div>

         <div className='flex flex-col items-center justify-center mt-[82px]'>
            <div className='flex flex-col items-center justify-center mb-9'>
               <button className='mb-[38px] clickable transform scale-100' onClick={() => setMiningActivated(!miningActivated)}>
                  <div className={`shadow-[0px_0px_119.05px_0px_#B8FF5E4D] w-[196px] h-[196px] rounded-full flex items-center justify-center relative transition-all duration-300 
                  ${miningActivated ? "border-8 border-l-[#9D62D9] border-t-[#6EBA0E] border-b-[#F97316] border-r-[#F97316] rotateMine" : 'bg-[linear-gradient(180deg,_#424748_0%,_#003B46_145.74%)] '}
                     `}>

                     <div className={`w-[157px] h-[157px] rounded-full flex items-center justify-center transform -rotate-45 relative transition-all duration-300 
                        ${miningActivated ? 'bg-[#16171A]' : 'bg-[linear-gradient(177.96deg,_#424748_-27.02%,_#003B46_189.41%)] '}
                        `}>
                        {miningActivated ? (
                           <div className='rotate-45'>
                              <h2 className='text-lg text-center text-(--color2) leading-tight'>Cycling</h2>
                              <h1 className='text-center text-[28px] font-bold text-[#F2F2FA] leading-tight '>$30/0.5</h1>
                              <p className='text-center text-xs font-extralight text-[#6EBA0E]'>+0.02 (Per/hr)</p>
                           </div>
                        ) : (<Image src={reja_icon} alt="Reja Icon" className='w-[72px] h-[72px] object-cover transform rotate-45' />)}
                     </div>
                  </div>
               </button>
               <p className='flex justify-center items-center gap-1 text-lg font-semibold text-(--color2)'>
                  <span>{miningActivated ? <Icon icon='ri:hourglass-fill' className='text-[#B8FF5E]' /> : <Icon icon='gravity-ui:thunderbolt-fill' className='text-[#B8FF5E]' />}</span>
                  <span>{miningActivated ? timer + ' Left' : 'Tap to start Cycle'}</span>
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
