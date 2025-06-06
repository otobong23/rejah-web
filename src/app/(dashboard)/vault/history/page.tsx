'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const FILTER = [ 'All', 'Income', 'Deposit', 'Commission', 'Bonus' ]

const page = () => {
   const router = useRouter()
   const [stack, setStack] = useState(1);
   return (
      <div>
         <button onClick={() => stack > 1 ? setStack(prev => prev - 1) : router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
            <Icon icon='fluent:ios-arrow-24-regular' className="" />
         </button>
         <h1 className="text-[40px] font-bold mb-8">Account History</h1>
         <div className="flex gap-2 my-3">
            {FILTER.map(a => (
               <button key={a} className='py-2 px-4 min-w-[90px] rounded-[15px] flex items-center justify-center bg-[#002732]'>{a}</button>
            ))}
         </div>
      </div>
   )
}

export default page