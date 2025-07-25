'use client';
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';

const NAVBAR_LIST = [
   {
      title: 'home',
      icon: 'majesticons:home',
      path: '/',
   },
   {
      title: 'tier',
      icon: 'majesticons:data',
      path: '/tiering/tier',
   },
   {
      title: 'referrals',
      icon: 'fluent:people-24-filled',
      path: '/crew',
   },
   {
      title: 'vault',
      icon: 'solar:money-bag-bold',
      path: '/vault',
   },
]

const Navbar = () => {
   const pathname = usePathname()
   const [isActive, setIsActive] = useState('home')
   useEffect(() => {
      const currentPath = pathname.split('/')[2]
      const activeItem = NAVBAR_LIST.find(item => item.path.match(`/${currentPath}`))
      if (activeItem) {
         setIsActive(activeItem.title)
      } else {
         setIsActive('home')
      }
   }, [pathname, isActive])
   return (
      <div className='px-4 lg:px-24'>
         <div className='bg-(--color4) text-[#E5EDDA] shadow-[-5px_-5px_15px_5px_#0D2730] rounded-[15px]'>
            <ul className='flex items-center justify-between gap-4 py-5 px-14'>
               {NAVBAR_LIST.map(({ icon, path, title }) => (
                  <li key={icon}>
                     <Link href={'/dashboard'+path} className={isActive === title ? 'text-(--color7)' : 'text-(--color2)'} key={icon}>
                        <Icon icon={icon} className="text-2xl" />
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   )
}

export default Navbar