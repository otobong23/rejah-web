import React from 'react'
import { Metadata } from 'next';
import TierPage from './TierPage';

export const metadata:Metadata = {
   title: "Tier",
}


const page = () => {
  return (
    <TierPage />
  )
}

export default page