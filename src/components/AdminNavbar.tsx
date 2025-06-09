'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';

const NAVBAR_LIST = [
   {
      title: 'dashboard',
      icon: 'tdesign:chart-ring-filled',
      path: '/admin',
   },
   {
      title: 'tier',
      icon: 'majesticons:data',
      path: '/tier',
   },
   {
      title: 'transactions',
      icon: 'icon-park-solid:transaction-order',
      path: '/admin/transactions',
   },
   {
      title: 'admin',
      icon: 'fluent:person-12-filled',
      path: '/admin/account',
   },
]

const AdminNavbar = () => {
   const pathname = usePathname()
   const [isActive, setIsActive] = useState('home')
   useEffect(() => {
      const currentPath = pathname.split('/')[1]
      const activeItem = NAVBAR_LIST.find(item => item.path === `/${currentPath}`)
      if (activeItem) {
         setIsActive(activeItem.title)
      } else {
         setIsActive('dashboard')
      }
   }, [pathname, isActive])
   return (
      <div className='px-4'>
         <div className='bg-(--color4) text-[#E5EDDA] shadow-[-5px_-5px_15px_5px_#0D2730] rounded-[15px]'>
            <ul className='flex items-center justify-between gap-4 py-5 px-14'>
               {NAVBAR_LIST.map(({ icon, path, title }) => (
                  <li key={icon}>
                     <Link href={path} className={isActive === title ? 'text-(--color7)' : 'text-(--color2)'} key={icon}>
                        <Icon icon={icon} className="text-2xl" />
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   )
}

export default AdminNavbar