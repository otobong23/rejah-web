import { Metadata } from 'next'
import React from 'react'
import FAQ from './FAQ'

export const metadata:Metadata = {
   title: "Frequently Answered Question",
}

const page = () => {
  return (
    <FAQ />
  )
}

export default page