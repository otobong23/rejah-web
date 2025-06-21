import React from 'react'
import HomeScreen from './HomeScreen'
import { Metadata } from 'next'

export const metadata:Metadata = {
   title: "Dashboard",
}

const page = () => {
  return (
    <HomeScreen />
  )
}

export default page