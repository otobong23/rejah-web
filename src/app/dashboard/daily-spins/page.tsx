import { Metadata } from 'next'
import React from 'react'
import DailySpins from './DailySpins'

export const metadata:Metadata = {
   title: "Daily Spins",
}


const page = () => {
  return (
    <div>
      <DailySpins />
    </div>
  )
}

export default page