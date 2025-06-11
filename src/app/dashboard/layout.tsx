import Navbar from '@/components/Navbar';
import React from 'react'
import WithAuth from './WithAuth';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WithAuth>
      <div className="bg-(--color4)  lg:bg-[url('/Desktop_bg.png')] bg-cover bg-no-repeat bg-center min-h-screen relative text-(--color2) px-4 lg:px-24 pb-20 pt-6 space-y-6 flex flex-col justify-between">
        {children}
        <div className='fixed bottom-0 left-0 right-0 pb-4 z-50 bg-(--color4) lg:bg-transparent'>
          <Navbar />
        </div>
      </div>
    </WithAuth>
  )
}

export default layout