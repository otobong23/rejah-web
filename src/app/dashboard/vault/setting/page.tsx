import React from 'react'
import { Metadata } from 'next';
import Settings from './Setting';

export const metadata:Metadata = {
   title: "Settings",
}

const page = () => {
  return (
    <Settings />
  )
}

export default page