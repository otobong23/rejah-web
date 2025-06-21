import React from 'react'
import { Metadata } from 'next';
import MiningPage from './Mining';

export const metadata:Metadata = {
   title: "Mining",
}

const page = () => {
  return (
    <MiningPage />
  )
}

export default page