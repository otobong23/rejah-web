import AdminNavbar from '@/components/AdminNavbar';
import React from 'react'

const layout = ({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) => {
   return (
      <div className="bg-(--color4) lg:bg-[url('/Desktop_bg.png')] bg-cover bg-no-repeat bg-center min-h-screen relative text-(--color2) px-4 pb-20 pt-6 space-y-6 flex flex-col justify-between">
         {children}
         <div className='fixed bottom-0 left-0 right-0 pb-4 z-50 bg-(--color4)'>
            <AdminNavbar />
         </div>
      </div>
   )
}

export default layout