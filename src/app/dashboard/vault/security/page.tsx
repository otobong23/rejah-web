import { Metadata } from 'next'
import React from 'react'
import Security from './Security'

export const metadata:Metadata = {
   title: "Security",
}

const page = () => {
  return (
    <Security />
  )
}

export default page