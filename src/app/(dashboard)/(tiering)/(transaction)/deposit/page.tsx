'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const NUMBER_LIST = [10, 30, 80, 120, 300, 500, 1000]

const page = () => {
   const router = useRouter()
   const [amount, setAmount] = useState('');
   const [account, setAccount] = useState('');
   const [stack, setStack] = useState(1);
   return (
      <div className='text-(--color2)'>
         {/* Header */}
         <button onClick={() => stack > 1 ? setStack(1) : router.back()} className="flex items-center space-x-2 mb-2 cursor-pointer hover:opacity-80 transition-all duration-300">
            <Icon icon='fluent:ios-arrow-24-regular' className="" />
         </button>
         <h1 className="text-[40px] font-bold mb-8">Deposit</h1>

         <div>
            <h3 className='text-xs pb-2'>Enter Amount</h3>
            <div className='flex gap-2 items-stretch'>
               <div className='flex justify-center items-center text-lg py-3.5 px-7 rounded-[15px] border-white border'>USDT</div>
               <input type="text"
                  placeholder='600,000.00'
                  className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
               />
            </div>
            {stack === 1 && (
               <div className='mt-6'>
                  <div className='flex gap-3 flex-wrap'>
                     {NUMBER_LIST.map((number, index) => (
                        <button onClick={() => setAmount(String(number))} key={index} className='flex justify-center items-center w-[70px] text-(--color2) text-sm px-2 py-[7px] border-white border rounded-[15px] transition-all duration-300'>
                           {number}
                        </button>
                     ))}
                  </div>

                  <button
                     onClick={() => setStack(2)}
                     className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${amount ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!amount}
                  >
                     Confirm
                  </button>
               </div>
            )}

            {stack === 2 && (
               <div className='flex flex-col mt-6'>
                  <div>
                     <input type="text"
                        placeholder='Account Number'
                        className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                     />
                  </div>
                  <button
                     className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${account ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!account}
                  >
                     Confirm
                  </button>
               </div>
            )}
         </div>
      </div>
   )
}

export default page