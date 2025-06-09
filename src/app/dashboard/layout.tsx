import Navbar from '@/components/Navbar';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='bg-(--color4) min-h-screen relative text-(--color2) px-4 pb-20 pt-6 space-y-6 flex flex-col justify-between'>
      {children}
      <div className='fixed bottom-0 left-0 right-0 pb-4 z-50 bg-(--color4)'>
        <Navbar />
      </div>
    </div>
  )
}

export default layout