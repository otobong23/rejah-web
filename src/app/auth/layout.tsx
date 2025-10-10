import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    // <div className="min-h-screen flex justify-center bg-[url('/Mobile_bg.png')] lg:bg-[url('/Desktop_bg.png')] bg-cover bg-no-repeat bg-center">
    <div className="min-h-screen flex justify-center bg-white">
      {children}
    </div>
  )
}

export default layout