'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
   const router = useRouter()
   const [amount, setAmount] = useState('')
   const handleSubmit = () => { }
   return (
      <div>
         <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 mb-2 cursor-pointer hover:opacity-80 transition-all duration-300"
         >
            <Icon icon="fluent:ios-arrow-24-regular" />
         </button>
         <div className='flex justify-between items-center pb-10'>
            <h1 className="text-[40px] font-bold">PSM</h1>
            <div className='flex items-center justify-center'>
               <div className='w-[49px] h-[49px] rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
                  <Icon icon="solar:user-bold" className='text-[#808080]' width={23} />
               </div>
            </div>
         </div>

         <div className={`px-5 py-4 rounded-[15px] bg-[#0A1D28]`}>
            <h1 className={`text-base font-medium mb-1`}>Profit Stop</h1>
            <h2 className={`text-4xl font-extrabold pb-11`}>$25,000</h2>
            <div className='text-xs font-medium flex justify-between items-center'>
               <span>0%</span>
               <span>100%</span>
            </div>
            <div className='w-full h-[9px] rounded-[10px] bg-white/60 mt-1 relative overflow-hidden'>
               <div style={{ width: 50 + '%' }} className={`h-full rounded-[10px] absolute top-0 left-0 bg-[#3D6354]`}></div>
            </div>
         </div>
         <div className='flex gap-3.5 mt-3'>
            <div className='px-5 py-[14px] gap-3 rounded-[18px] bg-[#30363D] flex-1 flex justify-center items-center'>
               <div>
                  <p className='px-[5px] py-1 border border-(--color2) rounded-[21px] leading-tight'>Achieved</p>
                  <p className='text-xl font-extrabold'>$20,000</p>
               </div>
               <div className='relative'>
                  <span><Icon icon='tdesign:chart-ring-filled' className='text-[#6EBA0E] text-[46px]' /></span>
                  <span className='text-xl font-extrabold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-shadow-2xs'>20%</span>
               </div>
            </div>
            <div className='px-5 py-[14px] gap-3 rounded-[18px] bg-[#0A1D28] flex-1 flex justify-center items-center'>
               <div>
                  <p className='px-[5px] py-1 border border-(--color2) rounded-[21px] leading-tight'>Remaining</p>
                  <p className='text-xl font-extrabold'>$5,000</p>
               </div>
               <div className='relative'>
                  <span><Icon icon='tdesign:chart-ring-filled' className='text-[#424748] text-[46px]' /></span>
                  <span className='text-xl font-extrabold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-shadow-2xs'>20%</span>
               </div>
            </div>
         </div>

         <div className='mt-5'>
            <h3 className='pb-2 text-xs'>Change Profit Stop</h3>
            <div className='flex items-stretch gap-2 pb-3'>
               <div className='flex justify-center items-center text-lg py-3.5 px-7 rounded-[15px] border-white border'>USDT</div>
               <input type="text"
                  placeholder='600,000.00'
                  className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
               />
            </div>

            <button
               onClick={handleSubmit}
               className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${amount ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!amount}
            >
               Confirm
            </button>
         </div>
      </div>
   )
}

export default page