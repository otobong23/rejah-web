import React from 'react'
import { Metadata } from 'next';
import History from './History';

export const metadata:Metadata = {
   title: "History",
}

const page = () => {
  return (
    <History />
  )
}

export default page