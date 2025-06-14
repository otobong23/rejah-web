import { TRANSACTION_RULES } from '@/constant/Tier';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className=''>
      {children}
      <div className='bg-[#121A24] text-(--color2) p-4 pb-[46px] text-xs rounded-[15px] mt-[25px] max-w-[396px] mx-auto'>
         {TRANSACTION_RULES.map((rule, index) => (
            <div className='flex items-start gap-2 mb-4' key={index}>
               <span>{index + 1}.</span>
               <p>{rule}</p>
            </div>
         ))}
      </div>
    </div>
  )
}

export default layout