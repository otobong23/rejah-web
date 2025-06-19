'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation';
import React from 'react'

const actions = [
  { icon: 'mingcute:history-anticlockwise-fill', label: 'history' },
  { icon: 'lsicon:setting-filled', label: 'settings' },
  { icon: 'tdesign:chart-ring-filled', label: 'Data summary' },
  { icon: 'material-symbols:shield', label: 'security' }
];

const page = () => {
  const router = useRouter()
  const handleClick = (label: string) => {
    if (label === 'history'){
      router.push('/admin/transactions')
      return
    }
    router.push(`/admin/account/${label}`)
  }

  return (
    <div>
      <div className='px-[25px] py-[34px] bg-(--color1) rounded-[15px] flex items-center justify-center flex-col gap-4'>
        <div className='w-[98px] h-[98px] rounded-full bg-[#EFEFEF] flex items-center justify-center'>
          <Icon icon="eos-icons:admin" className='text-[#808080]' width={48} />
        </div>
        <div className='flex items-center justify-center flex-col'>
          <h1 className='text-2xl font-semibold text-(--color2)'>Admin</h1>
        <p className='text-sm text-(--color2)/70'>ID: 4R890B0S</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#121A24] mt-3 py-6 lg:py-[52px] px-4 lg:px-32 rounded-[15px] gap-3">
        {actions.map(({ icon, label }, index) => (
          <button
            onClick={() => handleClick(label)}
            key={index}
            className="flex flex-col items-center p-3"
          >
            <div>
              <Icon icon={icon} className='text-[40px] lg:text-[52px] text-(--color2)' />
            </div>
            <p className="text-xs lg:text-base text-center text-white capitalize">{label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default page