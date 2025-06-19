'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import Rectangle2 from '@/assets/Rectangle2.svg'
import React from 'react'
import { useAdminContext } from '@/store/adminContext'


const page = () => {
   const { admin } = useAdminContext()

   const LIST = [
      {
         title: 'Total Deposits',
         value: admin.totalDeposit ?? 0,
         progress: 100
      },
      {
         title: 'Total Withdrawals',
         value: admin.totalWithdraw ?? 0,
         progress: 60
      },
      {
         title: 'Calculated Profit',
         value: (admin.totalDeposit ?? 0) - (admin.totalWithdraw ?? 0),
         progress: 30
      },
      {
         title: 'Profit Stop',
         value: admin.ProfitStop ?? 0,
         progress: 80
      },
   ]

   return (
      <div className='text-(--color2)'>
         <div className='flex justify-between items-center pb-10'>
            <h1 className="text-[40px] font-bold">Dashboard</h1>
            <div className='flex items-center justify-center'>
               <div className='w-[49px] h-[49px] rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
                  <Icon icon="eos-icons:admin" className='text-[#808080]' width={23} />
               </div>
            </div>
         </div>

         <div className='grid grid-cols-2 gap-3'>
            {LIST.map(({ title, value, progress }, i) => (
               <div key={title} className={`px-5 py-4 rounded-[15px] ${i === 0 ? 'bg-(--color2) text-[#000914]' : 'bg-[#0A1D28]'}`}>
                  <h1 className={`text-sm font-medium mb-1`}>{title}</h1>
                  <h2 className={`text-xl font-extrabold pb-11`}>{Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h2>
                  <div className='text-xs font-medium flex justify-between items-center'>
                     <span>0%</span>
                     <span>100%</span>
                  </div>
                  <div className='w-full h-[9px] rounded-[10px] bg-white/60 mt-1 relative overflow-hidden'>
                     <div style={{ width: progress + '%' }} className={`h-full rounded-[10px] absolute top-0 left-0 ${i === 0 ? 'bg-(--color7)' : i === 1 ? 'bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' : i === 2 ? 'bg-(--color2)' : 'bg-[#3D6354]'}`}></div>
                  </div>
               </div>
            ))}
         </div>
         <div className='flex justify-end py-3'>
            <div className='bg-(--color1) rounded-[20px] px-5 py-[9px]'>
               <Link href='dashboard/psm' className='text-[#F68A3F]'>Profit Stop Management</Link> 
            </div>
         </div>
      </div>
   )
}

export default page