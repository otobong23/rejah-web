import Navbar from '@/components/Navbar';
import React from 'react'
import WithAuth from './WithAuth';
import { UserProvider } from '@/store/userContext';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <UserProvider>
      <WithAuth>
        {/* <div className="bg-(--background)  lg:bg-[url('/Desktop_bg.png')] bg-cover bg-no-repeat bg-center min-h-screen relative text-(--color2) px-4 lg:px-24 pb-20 pt-6 space-y-6 flex flex-col justify-between"> */}
        <div className="bg-(--background) min-h-screen relative text-(--color2) px-4 lg:px-24 pb-20 pt-6 space-y-6 flex flex-col justify-between">
          {children}
          <div className='fixed bottom-0 left-0 right-0 pb-6 z-50 bg-(--color4) rounded-t-2xl'>
            <Navbar />
          </div>
        </div>
      </WithAuth>
    </UserProvider>
  )
}

export default layout