import AdminNavbar from '@/components/AdminNavbar';
import { AdminProvider } from '@/store/adminContext';
import React from 'react'
import AdminAuth from './AdminAuth';
import { Metadata } from 'next';

export const metadata:Metadata = {
   title: "Admin",
}

const layout = ({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) => {
   return (
      <div className="bg-(--background) lg:bg-[url('/Desktop_bg.png')] bg-cover bg-no-repeat bg-center min-h-screen relative text-(--color2) px-4 pb-20 pt-6 space-y-6 flex flex-col justify-between">
         <AdminProvider>
            <AdminAuth>
               {children}
            </AdminAuth>
         </AdminProvider>
         <div className='fixed bottom-0 left-0 right-0 pb-4 z-50 bg-(--background)'>
            <AdminNavbar />
         </div>
      </div>
   )
}

export default layout