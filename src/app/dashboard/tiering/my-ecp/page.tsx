import React from 'react'
import { Metadata } from 'next';
import MyECP from './MyECP';

export const metadata:Metadata = {
   title: "My ECP",
}

const page = () => {
  return (
    <MyECP />
  )
}

export default page